package lategardener.crypto.controller;

import lategardener.crypto.model.User;
import lategardener.crypto.service.UserService;
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


    // API

    @GetMapping(path = "/registration")
    public String registration(Model model){
        model.addAttribute("user", new User());
        return "registration";
    }

    @GetMapping(path = "/signUp")
    public String signUpPage(Model model){
        model.addAttribute("user", new User());
        return "signUp";
    }

    @GetMapping(path = "/signIn")
    public String SignInPage(Model model){
        model.addAttribute("user", new User());
        return "signIn";
    }


    @PostMapping("/validate")
    public ResponseEntity<String> validateUser(@RequestBody User user) {
        boolean isValid = userService.validateUserCredentials(user.getEmail(), user.getPassword());
        if (isValid) {
            return ResponseEntity.ok("valid");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @GetMapping(path = "/dashboard")
    public String dashBoard(){
        return "userPage";
    }


    @PostMapping("/registerUser")
    public String registerUser(@ModelAttribute User user, Model model) {

        String responseMessage = userService.addUser(user);
        if (responseMessage != null) {
            model.addAttribute("emailError", responseMessage); // Ajoute le message d'erreur à la vue
            return "registration"; // Retourne à la vue de l'inscription avec l'erreur
        }
        return "success"; // Redirige vers une page de succès
    }


    @PostMapping("/checkEmail")
    @ResponseBody
    public boolean checkEmail(@RequestParam String email) {
        return userService.emailExist(email);
    }



}
