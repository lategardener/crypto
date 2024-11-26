package lategardener.crypto.controller;

import jakarta.servlet.http.HttpSession;
import lategardener.crypto.model.PaymentMethod;
import lategardener.crypto.model.User;
import lategardener.crypto.service.BankAccountService;
import lategardener.crypto.service.CryptocurrencyService;
import lategardener.crypto.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/paymentMethod")
public class PaymentMethodController {


    @Autowired
    private PaymentMethodService paymentMethodService;

    @Autowired
    private  CryptocurrencyService cryptocurrencyService;

    @Autowired
    private BankAccountService bankAccountService;

    @GetMapping(path = "/add/{user_id}")
    public String registration(Model model, @PathVariable ("user_id") Long id){
        model.addAttribute("paymentMethod", new PaymentMethod());
        return "payment";
    }


    @GetMapping(path = "/payment")
    public String cryptoPaymentPage(HttpSession session, Model model){
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser != null) {
            // Current user
            model.addAttribute("user", currentUser);
            // ajouter toutes les cryptos disponibles
            model.addAttribute("AvailableCryptos", cryptocurrencyService.getAllCryptoccurencies());
            model.addAttribute("bankAccounts", bankAccountService.allUserBankAccount(currentUser.getId()));
        }
        return "cryptoPaymentPage";
    }
}
