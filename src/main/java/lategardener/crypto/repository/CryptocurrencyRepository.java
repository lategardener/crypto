package lategardener.crypto.repository;

import lategardener.crypto.model.Cryptocurrency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CryptocurrencyRepository extends JpaRepository<Cryptocurrency, Long> {
    @Query(value = "select * from cryptocurrency where symbol = ?1", nativeQuery = true)
    Optional<Cryptocurrency>  findBySymbol(String symbol);

}
