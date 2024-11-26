package lategardener.crypto.model;

import java.io.Serializable;
import jakarta.persistence.Embeddable;

@Embeddable
public class TransactionCryptoHoldingId implements Serializable {
    private Long transactionId;
    private Long cryptoHoldingId;

    // Getters and setters
    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Long getCryptoHoldingId() {
        return cryptoHoldingId;
    }

    public void setCryptoHoldingId(Long cryptoHoldingId) {
        this.cryptoHoldingId = cryptoHoldingId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TransactionCryptoHoldingId that = (TransactionCryptoHoldingId) o;

        if (!transactionId.equals(that.transactionId)) return false;
        return cryptoHoldingId.equals(that.cryptoHoldingId);
    }

    @Override
    public int hashCode() {
        int result = transactionId.hashCode();
        result = 31 * result + cryptoHoldingId.hashCode();
        return result;
    }
}
