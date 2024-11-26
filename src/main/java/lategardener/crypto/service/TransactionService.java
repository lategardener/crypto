package lategardener.crypto.service;

import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.model.Transaction;
import lategardener.crypto.model.TransactionCryptoHolding;
import lategardener.crypto.model.TransactionCryptoHoldingId;
import lategardener.crypto.repository.CryptoHoldingRepository;
import lategardener.crypto.repository.TransactionCryptoHoldingRepository;
import lategardener.crypto.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TransactionService {


    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CryptoHoldingService cryptoHoldingService;

    @Autowired
    private TransactionCryptoHoldingRepository transactionCryptoHoldingRepository;

    public void saveTransaction(String status, String transactionType, String sendCryptoSymbol, String receiveCryptoSymbol, Long walletId, Double sendAmount, Double getAmount) {
        // Créer une nouvelle transaction
        Transaction transaction = new Transaction();
        transaction.setDate(LocalDateTime.now());
        transaction.setStatus(status);
        transaction.setTransactionType(transactionType);

        // Sauvegarder la transaction pour générer son ID
        transaction = transactionRepository.save(transaction);

        // Récupérer les CryptoHoldings concernés par le symbole et le walletId
        CryptoHolding sendCrypto = cryptoHoldingService.getCryptoByNameAndWallet(walletId, sendCryptoSymbol);
        CryptoHolding receiveCrypto = cryptoHoldingService.getCryptoByNameAndWallet(walletId, receiveCryptoSymbol);

        // Enregistrer le TransactionCryptoHolding pour la crypto envoyée
        TransactionCryptoHolding sendTransactionCryptoHolding = new TransactionCryptoHolding();
        TransactionCryptoHoldingId sendTransactionCryptoHoldingId = new TransactionCryptoHoldingId();
        sendTransactionCryptoHoldingId.setTransactionId(transaction.getId());
        sendTransactionCryptoHoldingId.setCryptoHoldingId(sendCrypto.getId());
        sendTransactionCryptoHolding.setId(sendTransactionCryptoHoldingId);

        sendTransactionCryptoHolding.setTransaction(transaction);
        sendTransactionCryptoHolding.setCryptoHolding(sendCrypto);
        sendTransactionCryptoHolding.setAmount(-sendAmount); // Colonne supplémentaire

        transactionCryptoHoldingRepository.save(sendTransactionCryptoHolding);

        // Enregistrer le TransactionCryptoHolding pour la crypto reçue
        TransactionCryptoHolding receiveTransactionCryptoHolding = new TransactionCryptoHolding();
        TransactionCryptoHoldingId receiveTransactionCryptoHoldingId = new TransactionCryptoHoldingId();
        receiveTransactionCryptoHoldingId.setTransactionId(transaction.getId());
        receiveTransactionCryptoHoldingId.setCryptoHoldingId(receiveCrypto.getId());
        receiveTransactionCryptoHolding.setId(receiveTransactionCryptoHoldingId);

        receiveTransactionCryptoHolding.setTransaction(transaction);
        receiveTransactionCryptoHolding.setCryptoHolding(receiveCrypto);
        receiveTransactionCryptoHolding.setAmount(getAmount); // Colonne supplémentaire

        transactionCryptoHoldingRepository.save(receiveTransactionCryptoHolding);
    }



    public List<Long> getTransactionsByWallet(Long walletId) {
        return transactionRepository.findTransactionIdsByWalletId(walletId);
    }

    public Double findTransactionAmountCrypto(Long transactionID, Long cryptoID){
        return transactionRepository.findTransactionAmountCrypto(transactionID, cryptoID);
    }

    public Transaction findTransactionById(Long transactionID){
        Optional<Transaction>  transaction = transactionRepository.findById(transactionID);
        if (transaction.isPresent()){
            return transaction.get();
        }
        else{
            return  new Transaction();
        }
    }

}
