package lategardener.crypto.repository;

import lategardener.crypto.model.CryptoHolding;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;


import java.util.Optional;

@Repository
public interface CryptoHoldingRepository extends JpaRepository<CryptoHolding, Long> {
    @Query(value = " select * from crypto_holding h where h.wallet_id=?1 and h.symbol=?2 ", nativeQuery = true)
    Optional<CryptoHolding> findHoldingByWalletIdAndSymbol(Long walletId, String symbol);

    @Query(value = " select * from crypto_holding h where h.wallet_id=?1 and h.symbol not like 'USDC' ", nativeQuery = true)
    List<CryptoHolding> findAllExchangeableCryptos(Long walletId);



}


