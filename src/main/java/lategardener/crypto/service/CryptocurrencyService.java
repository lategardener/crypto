package lategardener.crypto.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.repository.CryptocurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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



    public Cryptocurrency getCryptocurrency(String symbol){
        Optional<Cryptocurrency> optionalCryptocurrency = cryptocurrencyRepository.findBySymbol(symbol);
        if (optionalCryptocurrency.isPresent()){
            return optionalCryptocurrency.get();
        }
        return null;
    }

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

    public Map<String, String> loadCryptoNames() throws IOException {
        ClassPathResource resource = new ClassPathResource("static/data/cryptocurrencies.json");
        byte[] data = FileCopyUtils.copyToByteArray(resource.getInputStream());
        String json = new String(data, StandardCharsets.UTF_8);
        return objectMapper.readValue(json, Map.class);
    }

    // Méthode pour ajouter une crypto en utilisant son symbole
    public void addCrypto(String symbol) {
        Optional<Cryptocurrency> existingCrypto = cryptocurrencyRepository.findBySymbol(symbol);
        if (!existingCrypto.isPresent()) {
            Map<String, Object> cryptoDetails = getCryptoDetails(symbol);

            // Vérifiez la présence des clés avant d'y accéder
            if (cryptoDetails != null) {
                Cryptocurrency crypto = new Cryptocurrency();

                // Extraire le symbole sans "USDT"
                String pureSymbol = symbol.replace("USDT", "").toUpperCase();

                // Utilisation de "lastPrice" pour le prix
                Object lastPrice = cryptoDetails.get("lastPrice");
                if (lastPrice != null) {
                    crypto.setCurrentPrice(Double.parseDouble(lastPrice.toString()));
                }

                // Utilisation de "marketCap" pour la capitalisation
                Object marketCap = cryptoDetails.get("marketCap");
                if (marketCap != null) {
                    crypto.setMarketCap(Double.parseDouble(marketCap.toString()));
                }

                // Récupérer le nom de la crypto depuis le fichier JSON
                try {
                    Map<String, String> cryptoNames = loadCryptoNames();
                    System.out.println('1');
                    String cryptoName = cryptoNames.get(pureSymbol); // Obtenir le nom correspondant au symbole
                    if (cryptoName != null) {
                        System.out.println('2');
                        crypto.setName(cryptoName); // Définir le nom de la crypto
                    } else {
                        crypto.setName("Unknown"); // Si le nom n'est pas trouvé
                        System.out.println('3');
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }

                crypto.setSymbol(pureSymbol); // Enregistrer le symbole pur

                Object priceChangePercent = cryptoDetails.get("priceChangePercent");
                if (priceChangePercent != null) {
                    crypto.setPriceChangePercent(Double.parseDouble(priceChangePercent.toString()));
                }
                crypto.setCreatedAt(LocalDate.now());

                cryptocurrencyRepository.save(crypto);
            }
        }
    }

    public void updateCryptoPrice(String symbol) {
        Optional<Cryptocurrency> existingCrypto = cryptocurrencyRepository.findBySymbol(symbol);
        if (existingCrypto.isPresent()) {
            if (!symbol.endsWith("USDT")) {
                symbol = symbol + "USDT"; // Ajouter "USDT" à la fin du symbole
            }
            double currentPrice = getCurrentPrice(symbol); // Cette méthode récupère le prix de l'API Binance, par exemple
            Cryptocurrency crypto = existingCrypto.get();
            crypto.setCurrentPrice(currentPrice); // Mettre à jour le prix de la cryptomonnaie
            cryptocurrencyRepository.save(crypto); // Sauvegarder la cryptomonnaie mise à jour dans la base de données
        } else {
            System.out.println("Cryptocurrency non trouvée pour le symbole : " + symbol);
        }
    }


    public List<Cryptocurrency> getAllCryptoccurencies(){
        return cryptocurrencyRepository.findAll();
    }

    public void updatePriceChangePercent() {
        // Récupérer toutes les cryptos stockées
        List<Cryptocurrency> allCryptos = cryptocurrencyRepository.findAll();

        for (Cryptocurrency crypto : allCryptos) {
            // Appeler l'API Binance pour chaque crypto pour obtenir les détails
            Map<String, Object> cryptoDetails = getCryptoDetails(crypto.getSymbol() + "USDT");

            if (cryptoDetails != null && cryptoDetails.containsKey("priceChangePercent")) {
                // Mettre à jour la variation de prix en pourcentage
                String priceChangePercent = cryptoDetails.get("priceChangePercent").toString();
                crypto.setPriceChangePercent(Double.parseDouble(priceChangePercent));
                cryptocurrencyRepository.save(crypto); // Enregistrer la mise à jour dans la base de données
            }
        }
    }
}
