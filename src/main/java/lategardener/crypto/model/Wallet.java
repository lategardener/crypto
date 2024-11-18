package lategardener.crypto.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Entity
@Table
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String adresse;
    private String name;
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy = "wallet", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<CryptoHolding> cryptoHoldings = new HashSet<>();


    public Wallet(String adresse, String name, User user) {
        this.adresse = adresse;
        this.name = name;
        this.user = user;
    }

    public Wallet() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<CryptoHolding> getCryptoHoldings() {
        return cryptoHoldings;
    }

    public void addCryptoHolding(CryptoHolding cryptoHolding) {
        this.cryptoHoldings.add(cryptoHolding);
    }
}
