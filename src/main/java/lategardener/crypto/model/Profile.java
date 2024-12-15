package lategardener.crypto.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

@Entity
@Table
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Past(message = "Date of birth has to be in the past")
    private LocalDate dateOfBirth;

    private String phoneNumber;

    private String address;

    private String avatarPath;

    @OneToOne(optional = true)
    @JoinColumn(name = "user_id", nullable = true)
    @JsonBackReference
    private User user;

    public Profile(LocalDate dateOfBirth, String phoneNumber, String address, User user, String avatarPath) {

        this.dateOfBirth = dateOfBirth;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.user = user;
        this.avatarPath = avatarPath;
    }

    public Profile() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAvatar() {
        return avatarPath;
    }

    public void setAvatar(String avatarPath) {
        this.avatarPath = avatarPath;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


}
