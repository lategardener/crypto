package lategardener.crypto.controller;

import lategardener.crypto.model.Transaction;
import lategardener.crypto.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
@RequestMapping("/transactions")
public class TransactionController {


    @Autowired
    private TransactionService transactionService;

    @PostMapping("/create")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Map<String, Object> requestData) {
        String status = (String) requestData.get("status");
        String transactionType = (String) requestData.get("transactionType");
        Long sendCryptoId = Long.valueOf((Integer) requestData.get("sendCryptoId"));
        Long receiveCryptoId = Long.valueOf((Integer) requestData.get("receiveCryptoId"));

        Transaction transaction = transactionService.saveTransaction(status, transactionType, sendCryptoId, receiveCryptoId);

        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }
}
