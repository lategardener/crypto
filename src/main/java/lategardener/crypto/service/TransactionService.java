package lategardener.crypto.service;

import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.model.Transaction;
import lategardener.crypto.repository.CryptoHoldingRepository;
import lategardener.crypto.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Service
public class TransactionService {


    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CryptoHoldingRepository cryptoHoldingRepository;

    public Transaction saveTransaction(String status, String transactionType, Long sendCryptoId, Long receiveCryptoId) {
        Transaction transaction = new Transaction();
        transaction.setDate(LocalDate.now());
        transaction.setStatus(status);
        transaction.setTransactionType(transactionType);

        Set<CryptoHolding> cryptoHoldings = new HashSet<>();

        // Récupérer les CryptoHoldings concernés
        CryptoHolding sendCrypto = cryptoHoldingRepository.findById(sendCryptoId)
                .orElseThrow(() -> new RuntimeException("Crypto holding for send not found"));
        cryptoHoldings.add(sendCrypto);

        CryptoHolding receiveCrypto = cryptoHoldingRepository.findById(receiveCryptoId)
                .orElseThrow(() -> new RuntimeException("Crypto holding for receive not found"));
        cryptoHoldings.add(receiveCrypto);

        transaction.setCryptoHoldings(cryptoHoldings);

        return transactionRepository.save(transaction);
    }
}
