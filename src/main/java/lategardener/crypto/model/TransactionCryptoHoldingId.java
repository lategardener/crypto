package lategardener.crypto.model;

import java.io.Serializable;
import jakarta.persistence.Embeddable;

@Embeddable
public class TransactionCryptoHoldingId implements Serializable {
    private Long transactionId;
    private Long cryptoHoldingId;

    // Getters and setters
}
