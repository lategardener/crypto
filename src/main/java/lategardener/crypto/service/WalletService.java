package lategardener.crypto.service;

import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.model.Cryptocurrency;
import lategardener.crypto.model.User;
import lategardener.crypto.model.Wallet;
import lategardener.crypto.repository.CryptoHoldingRepository;
import lategardener.crypto.repository.CryptocurrencyRepository;
import lategardener.crypto.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private CryptoHoldingRepository cryptoHoldingRepository;

    @Autowired
    private CryptocurrencyService cryptocurrencyService;

    public void createUserWallet(User user){
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setName("Default Wallet");
        wallet.setAdresse(generateWalletAddress());
        wallet.setUser(user);
        walletRepository.save(wallet);

        CryptoHolding cryptoHolding = new CryptoHolding(1.22, "Bitcoin", "BTC", wallet);
        cryptoHolding.setCryptocurrency(cryptocurrencyService.getCryptocurrency("BTC"));

        CryptoHolding cryptoHolding2 = new CryptoHolding(5.41, "Ethereum", "ETH", wallet);
        cryptoHolding2.setCryptocurrency(cryptocurrencyService.getCryptocurrency("ETH"));

        CryptoHolding cryptoHolding3 = new CryptoHolding(17.36, "BNB", "BNB", wallet);
        cryptoHolding3.setCryptocurrency(cryptocurrencyService.getCryptocurrency("BNB"));

        CryptoHolding cryptoHolding4 = new CryptoHolding(12.36, "Cardano", "ADA", wallet);
        cryptoHolding4.setCryptocurrency(cryptocurrencyService.getCryptocurrency("ADA"));

        CryptoHolding cryptoHolding5 = new CryptoHolding(125.36, "Toncoin", "TON", wallet);
        cryptoHolding5.setCryptocurrency(cryptocurrencyService.getCryptocurrency("TON"));

        cryptoHoldingRepository.saveAll(List.of(cryptoHolding, cryptoHolding2, cryptoHolding3, cryptoHolding4, cryptoHolding5));
    }

    private String generateWalletAddress() {
        // Utilise toutes les lettres de l'alphabet et les chiffres pour générer l'adresse
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder address = new StringBuilder();
        SecureRandom random = new SecureRandom();

        // Génère 15 caractères aléatoires
        for (int i = 0; i < 15; i++) {
            int index = random.nextInt(characters.length());
            address.append(characters.charAt(index));
        }
        return address.toString();
    }

    // Default wallet recovery
    public Wallet getUserDefaultWallet(Long userId){
        return walletRepository.userDefaultWallet(userId);
    }

}
