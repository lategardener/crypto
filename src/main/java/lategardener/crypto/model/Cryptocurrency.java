package lategardener.crypto.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table
public class Cryptocurrency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String symbol;
    private Double currentPrice;
    private Double marketCap;
    private LocalDate createdAt;

    private Double priceChangePercent;



    @OneToMany(mappedBy = "cryptocurrency", cascade = CascadeType.ALL)
    @JsonBackReference
    private Set<CryptoHolding> cryptoHoldings = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(Double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public Double getMarketCap() {
        return marketCap;
    }

    public void setMarketCap(Double marketCap) {
        this.marketCap = marketCap;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public Double getPriceChangePercent() {
        return priceChangePercent;
    }

    public void setPriceChangePercent(Double priceChangePercent) {
        this.priceChangePercent = priceChangePercent;
    }

    public Set<CryptoHolding> getCryptoHoldings() {
        return cryptoHoldings;
    }

    public void setCryptoHoldings(Set<CryptoHolding> cryptoHoldings) {
        this.cryptoHoldings = cryptoHoldings;
    }
}
