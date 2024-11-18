package lategardener.crypto.repository;

import lategardener.crypto.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    @Query(value="select * from wallet where user_id=?1 and name='Default Wallet'", nativeQuery = true)
    Wallet userDefaultWallet(Long userId);
}
