package lategardener.crypto.controller;

import lategardener.crypto.model.PaymentMethod;
import lategardener.crypto.service.BankAccountService;
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

    @GetMapping(path = "/add/{user_id}")
    public String registration(Model model, @PathVariable ("user_id") Long id){
        model.addAttribute("paymentMethod", new PaymentMethod());
        return "payment";
    }
}
