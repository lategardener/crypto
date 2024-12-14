package lategardener.crypto.service;


import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.repository.CryptoHoldingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.AccessType;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CryptoHoldingService {
    @Autowired
    CryptoHoldingRepository cryptoHoldingRepository;

    @Autowired
    CryptocurrencyService cryptocurrencyService;

    @Autowired
    WalletService walletService;


    public List<CryptoHolding> getAllExchangeableCryptos(Long walletId){
        return cryptoHoldingRepository.findAllExchangeableCryptos(walletId);
    }


    public CryptoHolding getCryptoByNameAndWallet(Long wallet_id, String symbol){
        Optional<CryptoHolding> crypto = cryptoHoldingRepository.findHoldingByWalletIdAndSymbol(wallet_id, symbol);
        if (crypto.isPresent()){
            return crypto.get();
        }
        CryptoHolding defaultCryptoHolding = new CryptoHolding();
        defaultCryptoHolding.setSymbol(symbol);
        defaultCryptoHolding.setAmount(0.0);
        return defaultCryptoHolding;
    }

    public void deductAmountCryptoFromWallet(Long walletId, String cryptoSymbol, double amountToDeduct) {
        CryptoHolding holding = cryptoHoldingRepository.findHoldingByWalletIdAndSymbol(walletId, cryptoSymbol)
                .orElseThrow(() -> new IllegalArgumentException("Crypto not found in wallet"));

        if (holding.getAmount() < amountToDeduct) {
            throw new IllegalArgumentException("Insufficient balance for " + cryptoSymbol);
        }

        holding.setAmount(holding.getAmount() - amountToDeduct);
        cryptoHoldingRepository.save(holding);
    }


    public void addAmountCryptoFromWallet(Long walletId, String cryptoSymbol, double amountReceive) {
        Optional<CryptoHolding> holding = cryptoHoldingRepository.findHoldingByWalletIdAndSymbol(walletId, cryptoSymbol);
        if (holding.isPresent()){
            CryptoHolding holdingRecover = holding.get();


            holdingRecover.setAmount(holdingRecover.getAmount() + amountReceive);
            cryptoHoldingRepository.save(holdingRecover);
        }
        else{
            CryptoHolding newCrypto = new CryptoHolding();
            newCrypto.setAmount(amountReceive);
            newCrypto.setSymbol(cryptoSymbol);
            newCrypto.setWallet(walletService.getWallet(walletId));
            newCrypto.setCryptocurrency(cryptocurrencyService.getCryptocurrency(cryptoSymbol));
            newCrypto.setName(newCrypto.getCryptocurrency().getName());
            cryptoHoldingRepository.save(newCrypto);
        }
    }



}
