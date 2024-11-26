package lategardener.crypto.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transaction_crypto")
public class TransactionCryptoHolding {

    @EmbeddedId  // Utilisation de l'EmbeddedId pour la clé composite
    private TransactionCryptoHoldingId id;

    @ManyToOne
    @MapsId("transactionId")  // Lier la clé composite à l'entité Transaction
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @ManyToOne
    @MapsId("cryptoHoldingId")  // Lier la clé composite à l'entité CryptoHolding
    @JoinColumn(name = "crypto_holding_id")
    private CryptoHolding cryptoHolding;

    private Double amount;  // Montant spécifique à chaque transaction

    // Getters et setters
    public TransactionCryptoHoldingId getId() {
        return id;
    }

    public void setId(TransactionCryptoHoldingId id) {
        this.id = id;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public CryptoHolding getCryptoHolding() {
        return cryptoHolding;
    }

    public void setCryptoHolding(CryptoHolding cryptoHolding) {
        this.cryptoHolding = cryptoHolding;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
