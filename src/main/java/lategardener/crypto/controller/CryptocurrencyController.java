package lategardener.crypto.controller;

import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.service.CryptocurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("/crypto")
public class CryptocurrencyController {

    @Autowired
    CryptocurrencyService cryptocurrencyService;

//    REST API
    @GetMapping(path = "/api/crypto/get/")
    @ResponseBody
    public Cryptocurrency getAllCrypto(@RequestParam String symbol){
        return cryptocurrencyService.getCryptocurrency(symbol);
    }

    @GetMapping(path = "/api/cryptos/getAll")
    @ResponseBody
    public List<Cryptocurrency> getAllCryptocurrencies(){
        return cryptocurrencyService.getAllCryptoccurencies();
    }

    @GetMapping(path = "/api/cryptos/getAllSymbols")
    @ResponseBody
    public List<String> getAllCryptocurrenciesSymbols(){
        return cryptocurrencyService.getAllValidSymbols();
    }

    @GetMapping(path = "/api/cryptos/getAllInfos")
    @ResponseBody
    public Map<String, Object> getAllCryptocurrenciesInfo(@RequestParam String symbol){
        return cryptocurrencyService.getCryptoDetails(symbol);
    }


    @PostMapping(path = "/api/cryptos/add")
    @ResponseBody
    public void addCryptocurrency(@RequestParam(required = true) String symbol){
        cryptocurrencyService.addCrypto(symbol);
    }

    //    API


    @PutMapping(path = "/updatePrice")
    @ResponseBody
    public ResponseEntity<Void> updateCryptocurrencyPrice(){
        List<Cryptocurrency> allCryptos = cryptocurrencyService.getAllCryptoccurencies();
        for (Cryptocurrency crypto : allCryptos){
            cryptocurrencyService.updateCryptoPrice(crypto.getSymbol());
        }
        return ResponseEntity.ok().build(); // Retourne un statut 200 sans contenu
    }

    @PutMapping ("/updatePriceChangePercent")
    @ResponseBody
    public ResponseEntity<Void> updatePriceChangePercent() {
        cryptocurrencyService.updatePriceChangePercent();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/homePage")
    public String homePage(Model model) {
        // Récupérer toutes les cryptomonnaies de la base de données
        List<Cryptocurrency> cryptocurrencies = cryptocurrencyService.getAllCryptoccurencies();

        // Ajouter les cryptomonnaies au modèle Thymeleaf
        model.addAttribute("cryptos", cryptocurrencies);

        // Retourner la vue avec les cryptomonnaies
        return "homePage"; // Assurez-vous que cette page est ton fichier homePage.html
    }

    @GetMapping(path = "/api/cryptos/getLastPrices")
    @ResponseBody
    public List<Double> getLastPrices(@RequestParam String symbol, @RequestParam(defaultValue = "10") int limit) {
        return cryptocurrencyService.getLastPrices(symbol + "USDT", limit);
    }


}
