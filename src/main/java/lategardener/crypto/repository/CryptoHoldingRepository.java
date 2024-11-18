package lategardener.crypto.repository;

import lategardener.crypto.model.CryptoHolding;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CryptoHoldingRepository extends JpaRepository<CryptoHolding, Long> {
}
