package lategardener.crypto.controller;


import jakarta.servlet.http.HttpSession;
import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.model.User;
import lategardener.crypto.model.Wallet;
import lategardener.crypto.service.CryptoHoldingService;
import lategardener.crypto.service.CryptocurrencyService;
import lategardener.crypto.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/cryptoHolding")
public class CryptoHoldingController {

    @Autowired
    private CryptoHoldingService cryptoHoldingService;

    @Autowired
    private CryptocurrencyService cryptocurrencyService;

    @Autowired
    private WalletService walletService;


    @GetMapping(path = "/api/getExchangeCryptos/{walletId}")
    @ResponseBody
    public List<CryptoHolding> getAllCryptoToExchange(@PathVariable ("walletId") Long walletId){
        return cryptoHoldingService.getAllExchangeableCryptos(walletId);
    }

    @GetMapping("/getUserCryptoBalance")
    @ResponseBody
    public Map<String, Double> getUserCryptoBalance(@RequestParam Long walletId, @RequestParam String symbol) {
        CryptoHolding cryptoHolding = cryptoHoldingService.getCryptoByNameAndWallet(walletId, symbol);
        Map<String, Double> response = new HashMap<>();
        response.put("amount", cryptoHolding.getAmount());
        return response;
    }

    @PutMapping("/deductAmount")
    public ResponseEntity<String> reduceCryptoAmount(@RequestParam Long walletId,
                                               @RequestParam String cryptoSymbol,
                                               @RequestParam double newQuantity) {
        try {
            cryptoHoldingService.deductAmountCryptoFromWallet(walletId, cryptoSymbol, newQuantity);
            return ResponseEntity.ok("Crypto quantity updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }


    @PutMapping("/increaseAmount")
    public ResponseEntity<String> increaseCryptoAmount(@RequestParam Long walletId,
                                                    @RequestParam String cryptoSymbol,
                                                    @RequestParam double newQuantity) {
        try {
            cryptoHoldingService.addAmountCryptoFromWallet(walletId, cryptoSymbol, newQuantity);
            return ResponseEntity.ok("Crypto quantity updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping(path = "/send")
    public String cryptoSendingPage(HttpSession session, Model model){
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser != null) {
            // Current user
            model.addAttribute("user", currentUser);
            // ajouter toutes les cryptos disponibles
            Wallet defaultWallet = walletService.getUserDefaultWallet(currentUser.getId());
            model.addAttribute("defaultWallet", defaultWallet);
            model.addAttribute("userCryptos", defaultWallet.getCryptoHoldings());

        }
        else{
            throw new IllegalStateException("User not connected");
        }
        return "cryptoSendPage";
    }

    @GetMapping(path = "/sell")
    public String cryptoSellingPage(HttpSession session, Model model){
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser != null) {
            // Current user
            model.addAttribute("user", currentUser);
            // ajouter toutes les cryptos disponibles
            Wallet defaultWallet = walletService.getUserDefaultWallet(currentUser.getId());
            model.addAttribute("defaultWallet", defaultWallet);
            model.addAttribute("userCryptos", cryptoHoldingService.getAllExchangeableCryptos(defaultWallet.getId()));
            model.addAttribute("usdc", cryptocurrencyService.getCryptocurrency("USDC"));
            model.addAttribute("usdcOwned", cryptoHoldingService.getCryptoByNameAndWallet(defaultWallet.getId(), "USDC"));
        }
        else{
            throw new IllegalStateException("User not connected");
        }
        return "cryptoSellingPage";
    }


}
