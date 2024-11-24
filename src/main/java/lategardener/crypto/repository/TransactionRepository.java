package lategardener.crypto.repository;

import lategardener.crypto.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query(value = "SELECT t.* FROM transaction_crypto t " +
            "JOIN crypto_holding c ON t.crypto_holding_id = c.id " +
            "WHERE c.wallet_id = :walletId", nativeQuery = true)
    List<Transaction> findTransactionsByWalletId(Long walletId);

}
