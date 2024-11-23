package lategardener.crypto.controller;


import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.service.CryptoHoldingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/cryptoHolding")
public class CryptoHoldingController {

    @Autowired
    private CryptoHoldingService cryptoHoldingService;

    @GetMapping("/getUserCryptoBalance")
    @ResponseBody
    public Map<String, Double> getUserCryptoBalance(@RequestParam Long walletId, @RequestParam String symbol) {
        CryptoHolding cryptoHolding = cryptoHoldingService.getCryptoByNameAndWallet(walletId, symbol);
        Map<String, Double> response = new HashMap<>();
        response.put("amount", cryptoHolding.getAmount());
        return response;
    }

    @PutMapping("/addAmount")
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




}
