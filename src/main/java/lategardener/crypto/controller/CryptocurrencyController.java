package lategardener.crypto.controller;

import jakarta.servlet.http.HttpSession;
import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.model.User;
import lategardener.crypto.service.CryptocurrencyService;
import lategardener.crypto.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("/crypto")
public class CryptocurrencyController {

    @Autowired
    CryptocurrencyService cryptocurrencyService;

    @Autowired
    ProfileService profileService;

    // Search a crypto by its symbol
    @GetMapping(path = "/api/crypto/get/")
    @ResponseBody
    public Cryptocurrency getCrypto(@RequestParam String symbol){
        return cryptocurrencyService.getCryptocurrency(symbol);
    }

    // Return all cryptocurrencies
    @GetMapping(path = "/api/cryptos/getAll")
    @ResponseBody
    public List<Cryptocurrency> getAllCryptocurrencies(){
        return cryptocurrencyService.getAllCryptoccurencies();
    }


    // Return all cryptocurrencies symbols
    @GetMapping(path = "/api/cryptos/getAllSymbols")
    @ResponseBody
    public List<String> getAllCryptocurrenciesSymbols(){
        return cryptocurrencyService.getAllValidSymbols();
    }


    // Return information about all cryptocurrencies
    @GetMapping(path = "/api/cryptos/getAllInfos")
    @ResponseBody
    public Map<String, Object> getAllCryptocurrenciesInfo(@RequestParam String symbol){
        return cryptocurrencyService.getCryptoDetails(symbol);
    }


    // Add a cryptocurrency
    @PostMapping(path = "/api/cryptos/add")
    @ResponseBody
    public void addCryptocurrency(@RequestParam(required = true) String symbol){
        cryptocurrencyService.addCrypto(symbol);
    }

    // Update a cryptocurrency price
    @PutMapping(path = "/updatePrice")
    @ResponseBody
    public ResponseEntity<Void> updateCryptocurrencyPrice(){
        List<Cryptocurrency> allCryptos = cryptocurrencyService.getAllCryptoccurencies();
        for (Cryptocurrency crypto : allCryptos){
            cryptocurrencyService.updateCryptoPrice(crypto.getSymbol());
        }
        return ResponseEntity.ok().build(); // Retourne un statut 200 sans contenu
    }

    // Update a cryptocurrency pricePencent
    @PutMapping ("/updatePriceChangePercent")
    @ResponseBody
    public ResponseEntity<Void> updatePriceChangePercent() {
        cryptocurrencyService.updatePriceChangePercent();
        return ResponseEntity.ok().build();
    }

    // return homePage
    @GetMapping("/homePage")
    public String homePage(Model model) {
        List<Cryptocurrency> cryptocurrencies = cryptocurrencyService.getAllCryptoccurencies();

        model.addAttribute("cryptos", cryptocurrencies);

        return "homePage";
    }

    // return page which display all available cryptocurrencies
    @GetMapping("/allCryptosPage")
    public String displayAllCryptosPage(@RequestParam(defaultValue = "0") int page, HttpSession session, Model model) {

        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser != null) {
            model.addAttribute("user", currentUser);
            model.addAttribute("profile", profileService.getprofile(currentUser.getId()));

            int pageSize = 10; // Nombre de cryptos par page
            List<Cryptocurrency> cryptocurrencies = cryptocurrencyService.getAllCryptoccurencies();

            // Trier les cryptos par nom croissant
            cryptocurrencies.sort(Comparator.comparing(Cryptocurrency::getName));

            // Calcul des sous-listes pour la pagination
            int start = page * pageSize;
            int end = Math.min(start + pageSize, cryptocurrencies.size());
            List<Cryptocurrency> paginatedCryptos = cryptocurrencies.subList(start, end);

            model.addAttribute("cryptos", paginatedCryptos);
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", (int) Math.ceil((double) cryptocurrencies.size() / pageSize));
        }

        return "displayAllCryptos"; // Assurez-vous que ce nom correspond au nom de votre template
    }


    // Return a cryptocurrency last ten prices
    @GetMapping(path = "/api/cryptos/getLastPrices")
    @ResponseBody
    public List<Double> getLastPrices(@RequestParam String symbol, @RequestParam(defaultValue = "10") int limit) {
        return cryptocurrencyService.getLastPrices(symbol + "USDT", limit);
    }


}
