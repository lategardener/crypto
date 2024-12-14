package lategardener.crypto.controller;

import lategardener.crypto.model.Wallet;
import lategardener.crypto.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping(path = "/api/wallet/{walletId}")
    @ResponseBody
    public Wallet getAllCryptocurrenciesInfo(@PathVariable ("walletId") Long walletId){
        return walletService.getWallet(walletId);
    }

    @GetMapping(path = "/api/walletAddress/")
    @ResponseBody
    public Wallet getWalletByAddress(@RequestParam String address){
        return walletService.getWalletByAddress(address);
    }

}
