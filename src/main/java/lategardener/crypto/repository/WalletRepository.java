package lategardener.crypto.repository;

import lategardener.crypto.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    @Query(value="select * from wallet where user_id=?1 and name='Default Wallet'", nativeQuery = true)
    Wallet userDefaultWallet(Long userId);

    @Query(value="select * from wallet where address=?1", nativeQuery = true)
    Optional<Wallet> walletByWalletAddress(String address);
}
