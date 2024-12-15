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
import java.util.Optional;

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


        CryptoHolding cryptoHolding = new CryptoHolding(15.0, "Usd-coin", "USDC", wallet);
        cryptoHolding.setCryptocurrency(cryptocurrencyService.getCryptocurrency("USDC"));

        cryptoHoldingRepository.save(cryptoHolding);
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


    public void addWalletCrypto(Long wallet_id, CryptoHolding cryptoHolding){
        Optional<Wallet> wallet = walletRepository.findById(wallet_id);
        if (wallet.isPresent()){
            Wallet walletRecover = wallet.get();
            walletRecover.addCryptoHolding(cryptoHolding);
            walletRepository.save(walletRecover);
        }
    }

    public Wallet getWallet (Long wallet_id){
        Optional<Wallet> wallet = walletRepository.findById(wallet_id);
        if(wallet.isPresent()){
            return wallet.get();
        }
        else{
            return new Wallet();
        }
    }

    public Wallet getWalletByAddress (String address){
        Optional<Wallet> wallet = walletRepository.walletByWalletAddress(address);
        if(wallet.isPresent()){
            return wallet.get();
        }
        else{
            return new Wallet();
        }
    }

}
