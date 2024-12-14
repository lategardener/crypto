package lategardener.crypto.repository;

import lategardener.crypto.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query(value = "SELECT DISTINCT tc.transaction_id " +
            "FROM transaction_crypto tc " +
            "JOIN crypto_holding ch ON tc.crypto_holding_id = ch.id " +
            "WHERE ch.wallet_id = :walletId " +
            "ORDER BY tc.transaction_id DESC", nativeQuery = true)
    List<Long> findTransactionIdsByWalletId(Long walletId);

    @Query(value = "select t.amount from transaction_crypto t where t.crypto_holding_id=?2 and t.transaction_id = ?1", nativeQuery = true)
    Double findTransactionAmountCrypto(Long transactionID, Long cryptoID);
}
