package lategardener.crypto.service;

import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.repository.CryptocurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
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

    @Value("${binance.api.key}")
    private String apiKey;


    public List<String> getAllValidSymbols() {
        String url = "https://api.binance.com/api/v3/exchangeInfo";
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        List<Map<String, Object>> symbols = (List<Map<String, Object>>) response.getBody().get("symbols");

        return symbols.stream()
                .map(symbolInfo -> symbolInfo.get("symbol").toString())
                .collect(Collectors.toList());
    }

    public Map<String, Object> getCryptoDetails(String symbol) {
        String url = "https://api.binance.com/api/v3/ticker/24hr?symbol=" + symbol;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-MBX-APIKEY", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        return response.getBody(); // Retourne toutes les infos
    }

    public double getCurrentPrice(String symbol) {
        String url = "https://api.binance.com/api/v3/ticker/price?symbol=" + symbol;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-MBX-APIKEY", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        return Double.parseDouble(response.getBody().get("price").toString());
    }

    public void addCrypto(String symbol) {
        Optional<Cryptocurrency> existingCrypto = cryptocurrencyRepository.findBySymbol(symbol);
        if (!existingCrypto.isPresent()) {
            Map<String, Object> cryptoDetails = getCryptoDetails(symbol);

            // Vérifiez la présence des clés avant d'y accéder
            if (cryptoDetails != null) {
                Cryptocurrency crypto = new Cryptocurrency();
                crypto.setSymbol(symbol);

                // Utilisez "lastPrice" et vérifiez s'il n'est pas null
                Object lastPrice = cryptoDetails.get("lastPrice");
                if (lastPrice != null) {
                    crypto.setCurrentPrice(Double.parseDouble(lastPrice.toString()));
                } else {
                    System.out.println("1");
                }

                Object marketCap = cryptoDetails.get("marketCap"); // Vérifiez si la clé "marketCap" existe
                if (marketCap != null) {
                    crypto.setMarketCap(Double.parseDouble(marketCap.toString()));
                } else {
                    System.out.println("2");
                }

                crypto.setName(cryptoDetails.get("symbol").toString());
                crypto.setCreatedAt(LocalDate.now());

                cryptocurrencyRepository.save(crypto);
            }
        }
    }


    public void updateCryptoPrice(String symbol) {
        Optional<Cryptocurrency> existingCrypto = cryptocurrencyRepository.findBySymbol(symbol);
        if (existingCrypto.isPresent()) {
            double currentPrice = getCurrentPrice(symbol);
            Cryptocurrency crypto = existingCrypto.get();
            crypto.setCurrentPrice(currentPrice);
            cryptocurrencyRepository.save(crypto);
        }
    }

    public List<Cryptocurrency> getAllCryptoccurencies(){
        return cryptocurrencyRepository.findAll();
    }
}
