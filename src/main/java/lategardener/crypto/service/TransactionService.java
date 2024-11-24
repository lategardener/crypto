package lategardener.crypto.service;

import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.model.Transaction;
import lategardener.crypto.repository.CryptoHoldingRepository;
import lategardener.crypto.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class TransactionService {


    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CryptoHoldingService cryptoHoldingService;

    public Transaction saveTransaction(String status, String transactionType, String sendCryptoSymbol, String receiveCryptoSymbol, Long walletId, Double sendAmount, Double getAmount) {
        // Création d'une nouvelle transaction
        Transaction transaction = new Transaction();
        transaction.setDate(LocalDate.now());
        transaction.setStatus(status);
        transaction.setTransactionType(transactionType);

        Set<CryptoHolding> cryptoHoldings = new HashSet<>();

        // Récupérer les CryptoHoldings concernés par le symbole et le walletId
        CryptoHolding sendCrypto = cryptoHoldingService.getCryptoByNameAndWallet(walletId, sendCryptoSymbol);

        CryptoHolding receiveCrypto = cryptoHoldingService.getCryptoByNameAndWallet(walletId, receiveCryptoSymbol);

        // Ajout des CryptoHoldings au Set
        cryptoHoldings.add(sendCrypto);
        cryptoHoldings.add(receiveCrypto);

        // Définir les CryptoHoldings dans la transaction
        transaction.setCryptoHoldings(cryptoHoldings);

        // Création d'une Map pour stocker les montants échangés
        Map<CryptoHolding, Double> amounts = new HashMap<>();
        amounts.put(sendCrypto, sendAmount); // Ajouter le montant envoyé
        amounts.put(receiveCrypto, getAmount); // Ajouter le montant reçu

        // Définir la Map des montants dans la transaction

        // Sauvegarder la transaction avec la mise à jour automatique de la table de jointure
        return transactionRepository.save(transaction);
    }



    public List<Transaction> getTransactionsByWallet(Long walletId) {
        return transactionRepository.findTransactionsByWalletId(walletId);
    }


}
