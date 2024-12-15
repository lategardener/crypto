package lategardener.crypto.repository;

import lategardener.crypto.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface
BankAccountRepository extends JpaRepository<BankAccount, Long> {
    // Return all user's bank account
    @Query(value = "select * from bank_account where user_id=?1", nativeQuery = true)
    List<BankAccount> allUserBankAccount(Long userId);
}
