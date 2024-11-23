package lategardener.crypto.controller;


import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.service.CryptoHoldingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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

}
