package lategardener.crypto.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transaction_crypto")
public class TransactionCryptoHolding {
    @EmbeddedId
    private TransactionCryptoHoldingId id;

    @ManyToOne
    @MapsId("transactionId")
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @ManyToOne
    @MapsId("cryptoHoldingId")
    @JoinColumn(name = "crypto_holding_id")
    private CryptoHolding cryptoHolding;

    private Double amount; // Colonne supplémentaire

    // Getters and setters
}
