package lategardener.crypto.service;

import lategardener.crypto.model.BankAccount;
import lategardener.crypto.model.PaymentMethod;
import lategardener.crypto.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    private String addPaymentMethod(BankAccount bankAccount, Long user_id){
        return null;
    }

}
