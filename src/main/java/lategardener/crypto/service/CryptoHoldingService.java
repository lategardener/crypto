package lategardener.crypto.service;

import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.repository.CryptoHoldingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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

    // Get all exchangeable cryptocurrencies for a specific wallet
    public List<CryptoHolding> getAllExchangeableCryptos(Long walletId){
        List<CryptoHolding> cryptoHoldings = cryptoHoldingRepository.findAllExchangeableCryptos(walletId);
        cryptoHoldings.sort(Comparator.comparing(CryptoHolding::getName)); // Sort by cryptocurrency name
        return cryptoHoldings;
    }

    // Get all cryptocurrencies held in a specific wallet
    public List<CryptoHolding> getCryptos(Long walletId){
        List<CryptoHolding> cryptoHoldings = cryptoHoldingRepository.findCryptos(walletId);
        cryptoHoldings.sort(Comparator.comparing(CryptoHolding::getName)); // Sort by cryptocurrency name
        return cryptoHoldings;
    }

    // Get a specific cryptocurrency by name and wallet ID. If not found, return a default holding.
    public CryptoHolding getCryptoByNameAndWallet(Long wallet_id, String symbol){
        Optional<CryptoHolding> crypto = cryptoHoldingRepository.findHoldingByWalletIdAndSymbol(wallet_id, symbol);
        if (crypto.isPresent()){
            return crypto.get(); // Return the existing holding
        }
        // Create and return a default holding if not found
        CryptoHolding defaultCryptoHolding = new CryptoHolding();
        defaultCryptoHolding.setSymbol(symbol);
        defaultCryptoHolding.setAmount(0.0);
        return defaultCryptoHolding;
    }

    // Deduct a specific amount of cryptocurrency from a wallet
    public void deductAmountCryptoFromWallet(Long walletId, String cryptoSymbol, double amountToDeduct) {
        CryptoHolding holding = cryptoHoldingRepository.findHoldingByWalletIdAndSymbol(walletId, cryptoSymbol)
                .orElseThrow(() -> new IllegalArgumentException("Crypto not found in wallet"));

        if (holding.getAmount() < amountToDeduct) {
            throw new IllegalArgumentException("Insufficient balance for " + cryptoSymbol); // Check if balance is sufficient
        }

        holding.setAmount(holding.getAmount() - amountToDeduct); // Deduct the amount
        cryptoHoldingRepository.save(holding); // Save the updated holding
    }

    // Add a specific amount of cryptocurrency to a wallet
    public void addAmountCryptoFromWallet(Long walletId, String cryptoSymbol, double amountReceive) {
        Optional<CryptoHolding> holding = cryptoHoldingRepository.findHoldingByWalletIdAndSymbol(walletId, cryptoSymbol);
        if (holding.isPresent()){
            CryptoHolding holdingRecover = holding.get();
            holdingRecover.setAmount(holdingRecover.getAmount() + amountReceive); // Add the received amount
            cryptoHoldingRepository.save(holdingRecover); // Save the updated holding
        }
        else{
            // Create a new holding if it doesn't exist
            CryptoHolding newCrypto = new CryptoHolding();
            newCrypto.setAmount(amountReceive); // Set the amount received
            newCrypto.setSymbol(cryptoSymbol);
            newCrypto.setWallet(walletService.getWallet(walletId)); // Set the wallet for the new holding
            newCrypto.setCryptocurrency(cryptocurrencyService.getCryptocurrency(cryptoSymbol)); // Set the cryptocurrency details
            newCrypto.setName(newCrypto.getCryptocurrency().getName()); // Set the cryptocurrency name
            cryptoHoldingRepository.save(newCrypto); // Save the new holding
        }
    }
}
