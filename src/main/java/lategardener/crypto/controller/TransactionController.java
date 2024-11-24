package lategardener.crypto.controller;

import lategardener.crypto.model.Transaction;
import lategardener.crypto.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/transactions")
public class TransactionController {


    @Autowired
    private TransactionService transactionService;

    @PostMapping("/create")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Map<String, Object> requestData) {
        System.out.println("----------------------------Received requestData: ---------------------------------------" + requestData);

        String status = (String) requestData.get("status");
        String transactionType = (String) requestData.get("transactionType");
        String sendCryptoId = (String) requestData.get("sendCryptoSymbol");
        String receiveCryptoId = (String) requestData.get("receiveCryptoSymbol");
        Long walletId = ((Integer) requestData.get("walletID")).longValue();

        Double sendAmount = ((Double) requestData.get("sendAmount")).doubleValue();
        Double getAmount = ((Double) requestData.get("getAmount")).doubleValue();

        Transaction transaction = transactionService.saveTransaction(status, transactionType, sendCryptoId, receiveCryptoId, walletId, sendAmount, getAmount);

        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }

    @GetMapping("/wallet/{walletId}/transactions")
    public ResponseEntity<List<Transaction>> getTransactionsByWallet(@PathVariable Long walletId) {
        List<Transaction> transactions = transactionService.getTransactionsByWallet(walletId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }


}
