package lategardener.crypto.controller;

import lategardener.crypto.model.BankAccount;
import lategardener.crypto.model.PaymentMethod;
import lategardener.crypto.model.User;
import lategardener.crypto.service.BankAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/bankAccount")
public class BankAccountController {


    @Autowired
    private BankAccountService bankAccountService;


    // Return all user's bank accounts
    @GetMapping(path = "/allBankAccounts/{user_id}")
    @ResponseBody
    public List<BankAccount> getAllUserAccounts(@PathVariable ("user_id") Long user_id){
        return bankAccountService.allUserBankAccount(user_id);
    }

    // Update user bank balance
    @PutMapping(path = "/updateBalance/{bank_id}")
    @ResponseBody
    public void getAllUserAccounts(@PathVariable ("bank_id") Long bank_id, @RequestBody Map<String, Object> requestData) {
        Double newBalance = parseToDouble(requestData.get("balance"));
        bankAccountService.updateBalance(bank_id, newBalance);
    }

    // Convert a value in double
    private Double parseToDouble(Object value) {
        if (value instanceof Double) {
            return (Double) value;  // Si c'est déjà un Double, on le retourne tel quel
        } else if (value instanceof Number) {
            return ((Number) value).doubleValue();  // Si c'est un autre type numérique, on le convertit en Double
        }
        return 0.0;  // Si ce n'est pas un nombre, on retourne 0.0 par défaut
    }

}
