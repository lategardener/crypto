package lategardener.crypto.controller;

import jakarta.servlet.http.HttpSession;
import lategardener.crypto.model.CryptoHolding;
import lategardener.crypto.model.User;
import lategardener.crypto.model.Wallet;
import lategardener.crypto.service.UserService;
import lategardener.crypto.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private WalletService walletService;

   // REST API

    @GetMapping(path = "/api/getUsers")
    @ResponseBody
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PostMapping(path = "/api/registerUser")
    @ResponseBody // Optional, used to send a JSON back
    public void addUser(@RequestBody User user){
        userService.addUser(user);
    }


    // Recuperation of total cryptoHoldings  sum price
    @GetMapping("/api/total-value")
    @ResponseBody
    public double getTotalValue(HttpSession session) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser != null) {
            Wallet wallet = walletService.getUserDefaultWallet(currentUser.getId());
            double totalValue = 0;
            for (CryptoHolding holding : wallet.getCryptoHoldings()) {
                totalValue += holding.getAmount() * holding.getCryptocurrency().getCurrentPrice();
            }
            return totalValue;
        }
        return 0;
    }



    // API

    @GetMapping(path = "/registration")
    public String registration(Model model){
        model.addAttribute("user", new User());
        return "registration";
    }

    // Sign up page
    @GetMapping(path = "/signUp")
    public String signUpPage(Model model){
        model.addAttribute("user", new User());
        return "signUp";
    }

    // Check email existence for the sign-up page
    @PostMapping("/checkEmail")
    @ResponseBody
    public boolean checkEmail(@RequestParam String email) {
        return userService.emailExist(email);
    }


    // Redirection to user dashboard page when sign-up page verification is done
    @PostMapping("/registerUser")
    public String registerUser(@ModelAttribute User user, Model model, HttpSession session) {

        String responseMessage = userService.addUser(user);
        if (responseMessage != null) {
            model.addAttribute("emailError", responseMessage); // Ajoute le message d'erreur à la vue
            return "error";
        }
        session.setAttribute("currentUser", user);
        return "redirect:/user/dashboard"; // Redirige vers la page de tableau de bord
    }


    // Sign in page
    @GetMapping(path = "/signIn")
    public String SignInPage(Model model){
        model.addAttribute("user", new User());
        return "signIn";
    }

    // Password and email validation for the sign-in page
    @PostMapping("/validate")
    public ResponseEntity<String> validateUser(@RequestBody User user) {
        boolean isValid = userService.validateUserCredentials(user.getEmail(), user.getPassword());
        if (isValid) {
            return ResponseEntity.ok("valid");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // user dashboard page
    @GetMapping(path = "/dashboard")
    public String dashBoard(HttpSession session, Model model) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser != null) {
            System.out.println("USER RECOVER WITH SUCCES");
            model.addAttribute("user", currentUser);
            model.addAttribute("defaultWallet", walletService.getUserDefaultWallet(currentUser.getId()));
        }
        return "userPage";
    }

}
