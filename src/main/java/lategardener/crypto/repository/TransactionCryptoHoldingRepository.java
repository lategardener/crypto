package lategardener.crypto.repository;

import lategardener.crypto.model.TransactionCryptoHolding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionCryptoHoldingRepository extends JpaRepository<TransactionCryptoHolding, Long> {
}
