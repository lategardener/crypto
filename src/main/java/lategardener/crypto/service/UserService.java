package lategardener.crypto.service;

import lategardener.crypto.model.BankAccount;
import lategardener.crypto.model.User;
import lategardener.crypto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BankAccountService bankAccountService;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public String addUser(User user) {
        Optional<User> userOptional = userRepository.findUserByEmail(user.getEmail());
        if (userOptional.isPresent()) {
            return "There is already a user with the same email"; // Retourne un message d'erreur
        }
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);
        bankAccountService.createBankAccountForUser(user);
        return null;
    }

    public boolean emailExist(String email){
        Optional<User> userOptional = userRepository.findUserByEmail(email);
        if (userOptional.isPresent()) {
            return true;
        }
        return false;
    }


    public boolean validateUserCredentials(String email, String password) {
        Optional<User> user = userRepository.findUserByEmail(email);

        if (user.isPresent()) {

            System.out.println("expected => email : " +  user.get().getEmail() + " password : " + user.get().getPassword());
            System.out.println("input => email : " +  email + " password : " + password);
            return user.get().getPassword().equals(password);
        }
        System.out.println("User not present");
        return false;
    }
}
