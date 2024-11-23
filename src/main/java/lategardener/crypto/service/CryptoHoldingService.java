package lategardener.crypto.service;


import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.repository.CryptoHoldingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.AccessType;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CryptoHoldingService {
    @Autowired
    CryptoHoldingRepository cryptoHoldingRepository;

    public CryptoHolding getCryptoByNameAndWallet(Long wallet_id, String symbol){
        Optional<CryptoHolding> crypto = cryptoHoldingRepository.findHoldingByWalletIdAndName(wallet_id, symbol);
        if (crypto.isPresent()){
            return crypto.get();
        }
        CryptoHolding defaultCryptoHolding = new CryptoHolding();
        defaultCryptoHolding.setSymbol(symbol);
        defaultCryptoHolding.setAmount(0.0);
        return defaultCryptoHolding;
    }


}
