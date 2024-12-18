package lategardener.crypto.config;

import lategardener.crypto.repository.CryptocurrencyRepository;
import lategardener.crypto.service.CryptocurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

@Configuration
public class CryptoccurencyConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }


    @Bean
    CommandLineRunner commandLineRunner(CryptocurrencyService cryptocurrencyService){
        return args -> {

            // Available cryptocurrencies
            if (cryptocurrencyService.getCryptocurrency("BTC") == null){
                cryptocurrencyService.addCrypto("BTCUSDT");
                cryptocurrencyService.addCrypto("TONUSDT");
                cryptocurrencyService.addCrypto("ETHUSDT");
                cryptocurrencyService.addCrypto("BNBUSDT");
                cryptocurrencyService.addCrypto("ADAUSDT");
                cryptocurrencyService.addCrypto("SOLUSDT");
                cryptocurrencyService.addCrypto("USDCUSDT");
                cryptocurrencyService.addCrypto("ATOMUSDT");
                cryptocurrencyService.addCrypto("XRPUSDT");
                cryptocurrencyService.addCrypto("LTCUSDT");
                cryptocurrencyService.addCrypto("TRXUSDT");
                cryptocurrencyService.addCrypto("PEPEUSDT");
            }
        };
    }
}
