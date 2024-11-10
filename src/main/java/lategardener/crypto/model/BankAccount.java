package lategardener.crypto.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table
public class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private String bankName;
    private String iban;
    private String bic;
    private Double balance;

    private String holderName;

    private String  holderSurname;
    private String expirationDate;

    private String cvv;
    private LocalDate createdAt;

    private String paymentNetwork;
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
    ;
    @OneToOne(mappedBy = "bankAccount", cascade = CascadeType.ALL)
    private PaymentMethod paymentMethod;

    public BankAccount(String accountNumber, String bankName, String iban, String bic, Double balance, String cvv,
                       LocalDate createdAt, String paymentNetwork, User user, PaymentMethod paymentMethod,
                       String holderName, String expirationDate, String holderSurname) {
        this.accountNumber = accountNumber;
        this.bankName = bankName;
        this.iban = iban;
        this.bic = bic;
        this.balance = balance;
        this.cvv = cvv;
        this.createdAt = createdAt;
        this.paymentNetwork = paymentNetwork;
        this.user = user;
        this.paymentMethod = paymentMethod;
        this.holderName = holderName;
        this.expirationDate = expirationDate;
        this.holderSurname = holderSurname;
    }

    public BankAccount() {
    }

    public String getPaymentNetwork() {
        return paymentNetwork;
    }

    public void setPaymentNetwork(String paymentNetwork) {
        this.paymentNetwork = paymentNetwork;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getBic() {
        return bic;
    }

    public void setBic(String bic) {
        this.bic = bic;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String  getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }


    public String getHolderSurname() {
        return holderSurname;
    }

    public void setHolderSurname(String holderSurname) {
        this.holderSurname = holderSurname;
    }

    @Override
    public boolean equals(Object o){
        if (o instanceof BankAccount){
            BankAccount b = (BankAccount) o;
            if (
                    b.getAccountNumber().equals(this.getAccountNumber()) &&
                    b.getBankName().equals(this.getBankName()) &&
                    b.getCvv().equals(this.getCvv()) &&
                    b.getHolderName().equals(this.getHolderName()) &&
                    b.getExpirationDate().equals(this.getExpirationDate())
            ){
                return  true;
            }
        }
        return false;
    }
}
