package lategardener.crypto.repository;

import lategardener.crypto.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface
BankAccountRepository extends JpaRepository<BankAccount, Long> {
}
