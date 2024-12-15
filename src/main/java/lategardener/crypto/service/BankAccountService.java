package lategardener.crypto.service;

import com.github.javafaker.Faker;
import lategardener.crypto.model.BankAccount;
import lategardener.crypto.model.User;
import lategardener.crypto.repository.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class BankAccountService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    // Banks address
    private static final List<String> FRENCH_BANKS = List.of(
            "BNP Paribas", "Société Générale", "Crédit Agricole",
            "Caisse d'Épargne", "Crédit Mutuel", "La Banque Postale",
            "Banque Populaire", "HSBC France", "LCL"
    );

    // Type of bank card
    private static final List<String> PAYMENT_NETWORKS = List.of("Visa", "Mastercard");

    // Faker to generate random values
    private final Faker faker = new Faker();

    // Create user bank account
    public void createBankAccountForUser(User user) {
        BankAccount bankAccount = new BankAccount();
        Random random = new Random();
        LocalDate today = LocalDate.now();

        String bankName = FRENCH_BANKS.get(random.nextInt(FRENCH_BANKS.size()));
        bankAccount.setBankName(bankName);

        bankAccount.setHolderName(user.getLastName());
        bankAccount.setHolderSurname(user.getFirstName());

        String paymentNetwork = PAYMENT_NETWORKS.get(random.nextInt(PAYMENT_NETWORKS.size()));
        bankAccount.setPaymentNetwork(paymentNetwork);

        bankAccount.setAccountNumber(faker.number().digits(16));
        bankAccount.setCvv(faker.number().digits(3));
        bankAccount.setIban(faker.finance().iban("FR"));
        bankAccount.setBic(faker.finance().bic());
        bankAccount.setBalance(faker.number().randomDouble(2, 100, 100000));
        bankAccount.setCreatedAt(LocalDate.now());
        bankAccount.setUser(user);

        int month = random.nextInt(12) + 1;

        // Générer une année future (entre l'année actuelle et +5 ans)
        int year = today.getYear() + random.nextInt(5) + 1;

        // Prendre les deux derniers chiffres de l'année
        int yearLastTwoDigits = year % 100;

        // Créer la date d'expiration sous le format "MM/YY"
        bankAccount.setExpirationDate(String.format("%02d/%02d", month, yearLastTwoDigits));


        bankAccountRepository.save(bankAccount);

    }


    // Return all user's bank account
    public List<BankAccount> allUserBankAccount(Long userId){
        return bankAccountRepository.allUserBankAccount(userId);
    }

    // Update user's balance
    public void updateBalance(Long bank_id, Double newBalance){
        Optional<BankAccount> bankAccount = bankAccountRepository.findById(bank_id);
        if (bankAccount.isPresent()){
            bankAccount.get().setBalance(newBalance);
            bankAccountRepository.save(bankAccount.get());
        }

    }
}
