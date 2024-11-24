package lategardener.crypto.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
@Entity
@Table
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate Date;
    private String status;
    private String transactionType;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @JoinTable(
            name = "transaction_crypto",
            joinColumns = @JoinColumn(name = "transaction_id"),
            inverseJoinColumns = @JoinColumn(name = "crypto_holding_id")
    )
    @Size(min = 1, max = 2, message = "The number of cryptocurrenies involved in this operation has to be between 1 and 2")
    private Set<CryptoHolding> cryptoHoldings = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return Date;
    }

    public void setDate(LocalDate date) {
        Date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public Set<CryptoHolding> getCryptoHoldings() {
        return cryptoHoldings;
    }

    public void setCryptoHoldings(Set<CryptoHolding> cryptoHoldings) {
        this.cryptoHoldings = cryptoHoldings;
    }
}
