package lategardener.crypto.controller;

import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.service.CryptocurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/crypto")
public class CryptocurrencyController {

    @Autowired
    CryptocurrencyService cryptocurrencyService;

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

    @PutMapping(path = "/api/cryptos/updatePrice")
    @ResponseBody
    public void updateCryptocurrencyPrice(){
        List<Cryptocurrency> allCryptos = cryptocurrencyService.getAllCryptoccurencies();
        for (Cryptocurrency crypto : allCryptos){
            cryptocurrencyService.updateCryptoPrice(crypto.getSymbol());
        }
    }
}
