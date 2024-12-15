package lategardener.crypto.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.repository.CryptocurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CryptocurrencyService {
    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CryptocurrencyRepository cryptocurrencyRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${binance.api.key}")
    private String apiKey;

    // Get a cryptocurrency by its symbol
    public Cryptocurrency getCryptocurrency(String symbol){
        Optional<Cryptocurrency> optionalCryptocurrency = cryptocurrencyRepository.findBySymbol(symbol);
        if (optionalCryptocurrency.isPresent()){
            return optionalCryptocurrency.get();
        }
        return null;
    }

    // Return all valid cryptocurrency symbols
    public List<String> getAllValidSymbols() {
        String url = "https://api.binance.com/api/v3/exchangeInfo";
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        List<Map<String, Object>> symbols = (List<Map<String, Object>>) response.getBody().get("symbols");

        return symbols.stream()
                .map(symbolInfo -> symbolInfo.get("symbol").toString())
                .collect(Collectors.toList());
    }

    // Get cryptocurrency details
    public Map<String, Object> getCryptoDetails(String symbol) {
        String url = "https://api.binance.com/api/v3/ticker/24hr?symbol=" + symbol;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-MBX-APIKEY", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        return response.getBody(); // Return all details
    }

    // Return the current price of a cryptocurrency
    public double getCurrentPrice(String symbol) {
        String url = "https://api.binance.com/api/v3/ticker/price?symbol=" + symbol;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-MBX-APIKEY", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        return Double.parseDouble(response.getBody().get("price").toString());
    }

    // Load cryptocurrency names from a JSON file
    public Map<String, String> loadCryptoNames() throws IOException {
        ClassPathResource resource = new ClassPathResource("static/data/cryptocurrencies.json");
        byte[] data = FileCopyUtils.copyToByteArray(resource.getInputStream());
        String json = new String(data, StandardCharsets.UTF_8);
        return objectMapper.readValue(json, Map.class);
    }

    // Add a cryptocurrency
    public void addCrypto(String symbol) {
        Optional<Cryptocurrency> existingCrypto = cryptocurrencyRepository.findBySymbol(symbol);
        if (!existingCrypto.isPresent()) {
            Map<String, Object> cryptoDetails = getCryptoDetails(symbol);

            // Check the presence of keys before accessing them
            if (cryptoDetails != null) {
                Cryptocurrency crypto = new Cryptocurrency();

                // Extract the symbol without "USDT"
                String pureSymbol = symbol.replace("USDT", "").toUpperCase();

                // Use "lastPrice" for the price
                Object lastPrice = cryptoDetails.get("lastPrice");
                if (lastPrice != null) {
                    crypto.setCurrentPrice(Double.parseDouble(lastPrice.toString()));
                }

                // Calculate market capitalization (Market Cap)
                Object volume = cryptoDetails.get("volume");
                if (lastPrice != null && volume != null) {
                    // Market Cap = Last Price * Volume
                    double marketCap = Double.parseDouble(lastPrice.toString()) * Double.parseDouble(volume.toString());
                    crypto.setMarketCap(marketCap);
                }

                // Retrieve the cryptocurrency name from the JSON file
                try {
                    Map<String, String> cryptoNames = loadCryptoNames();
                    String cryptoName = cryptoNames.get(pureSymbol); // Get the name corresponding to the symbol
                    if (cryptoName != null) {
                        crypto.setName(cryptoName); // Set the cryptocurrency name
                    } else {
                        crypto.setName("Unknown"); // If name is not found
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }

                crypto.setSymbol(pureSymbol); // Save the pure symbol

                Object priceChangePercent = cryptoDetails.get("priceChangePercent");
                if (priceChangePercent != null) {
                    crypto.setPriceChangePercent(Double.parseDouble(priceChangePercent.toString()));
                }
                crypto.setCreatedAt(LocalDate.now());

                cryptocurrencyRepository.save(crypto);
            }
        }
    }

    // Update the price of a cryptocurrency
    public void updateCryptoPrice(String symbol) {
        Optional<Cryptocurrency> existingCrypto = cryptocurrencyRepository.findBySymbol(symbol);
        if (existingCrypto.isPresent()) {
            if (!symbol.endsWith("USDT")) {
                symbol = symbol + "USDT"; // Add "USDT" to the symbol
            }
            double currentPrice = getCurrentPrice(symbol); // This method retrieves the price from the Binance API
            Cryptocurrency crypto = existingCrypto.get();
            crypto.setCurrentPrice(currentPrice); // Update the cryptocurrency price
            cryptocurrencyRepository.save(crypto); // Save the updated cryptocurrency in the database
        } else {
            System.out.println("Cryptocurrency not found for the symbol: " + symbol);
        }
    }

    // Return all cryptocurrencies
    public List<Cryptocurrency> getAllCryptoccurencies(){
        List<Cryptocurrency> cryptocurrencies = cryptocurrencyRepository.findAll();
        cryptocurrencies.sort(Comparator.comparing(Cryptocurrency::getName));
        return cryptocurrencies;
    }

    // Return all exchangeable cryptocurrencies
    public List<Cryptocurrency> getAllExchangeableCryptos(){
        List<Cryptocurrency> cryptocurrencies = cryptocurrencyRepository.findAllExchangeableCryptos();
        cryptocurrencies.sort(Comparator.comparing(Cryptocurrency::getName));
        return cryptocurrencies;
    }

    // Update cryptocurrency price change percentage
    public void updatePriceChangePercent() {
        // Retrieve all stored cryptocurrencies
        List<Cryptocurrency> allCryptos = cryptocurrencyRepository.findAll();

        for (Cryptocurrency crypto : allCryptos) {
            // Call the Binance API for each crypto to get the details
            Map<String, Object> cryptoDetails = getCryptoDetails(crypto.getSymbol() + "USDT");

            if (cryptoDetails != null && cryptoDetails.containsKey("priceChangePercent")) {
                // Update the price change percentage
                String priceChangePercent = cryptoDetails.get("priceChangePercent").toString();
                crypto.setPriceChangePercent(Double.parseDouble(priceChangePercent));

                // Market Cap update
                Object volume = cryptoDetails.get("volume");
                Object lastPrice = cryptoDetails.get("lastPrice");
                double marketCap = 0.0;
                if (lastPrice != null && volume != null) {
                    // Market Cap = Last Price * Volume
                    marketCap = Double.parseDouble(lastPrice.toString()) * Double.parseDouble(volume.toString());
                    crypto.setMarketCap(marketCap);
                }
                cryptocurrencyRepository.save(crypto); // Save the update in the database
            }
        }
    }

    // Return the last prices of a cryptocurrency
    public List<Double> getLastPrices(String symbol, int limit) {
        String url = String.format("https://api.binance.com/api/v3/klines?symbol=%s&interval=1m&limit=%d", symbol, limit);

        // Use ParameterizedTypeReference for the exact type of the response
        ResponseEntity<List<List<Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<List<Object>>>() {}
        );

        // Extract only the closing prices (5th element)
        return response.getBody().stream()
                .map(entry -> Double.parseDouble(entry.get(4).toString())) // 5th element = closing price
                .collect(Collectors.toList());
    }
}
