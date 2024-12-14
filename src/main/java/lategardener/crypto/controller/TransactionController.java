package lategardener.crypto.controller;

import lategardener.crypto.model.Transaction;
import lategardener.crypto.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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
        String sendCryptoSymbol = (String) requestData.get("sendCryptoSymbol");
        String receiveCryptoSymbol = (String) requestData.get("receiveCryptoSymbol");
        Long walletId = ((Integer) requestData.get("walletID")).longValue();
        Double sendAmount = parseToDouble(requestData.get("sendAmount"));
        Double getAmount = parseToDouble(requestData.get("getAmount"));

        transactionService.saveTransaction(status, transactionType, sendCryptoSymbol, receiveCryptoSymbol, walletId, sendAmount, getAmount);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    private Double parseToDouble(Object value) {
        if (value instanceof Double) {
            return (Double) value;  // Si c'est déjà un Double, on le retourne tel quel
        } else if (value instanceof Number) {
            return ((Number) value).doubleValue();  // Si c'est un autre type numérique, on le convertit en Double
        }
        return 0.0;  // Si ce n'est pas un nombre, on retourne 0.0 par défaut
    }


    @GetMapping("/wallet/{walletId}/transactions")
    public ResponseEntity<List<Long>> getTransactionsByWallet(@PathVariable Long walletId) {
        List<Long> transactions = transactionService.getTransactionsByWallet(walletId);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/{transactionId}/crypto/{cryptoId}/amount")
    @ResponseBody
    public Double getTransactionCryptoAmount(@PathVariable("transactionId") Long transactionId, @PathVariable("cryptoId") Long cryptoId) {
        return transactionService.findTransactionAmountCrypto(transactionId, cryptoId);
    }

    @GetMapping("/{transactionId}")
    @ResponseBody
    public Transaction getTransactionById(@PathVariable("transactionId") Long transactionId) {
        return transactionService.findTransactionById(transactionId);
    }

    @PostMapping("/transactionBuy/create")
    public ResponseEntity<Map<String, Object>> createTransactionBuy(@RequestBody Map<String, Object> requestData) {
        String status = (String) requestData.get("status");
        String transactionType = (String) requestData.get("transactionType");
        String cryptoSymbol = (String) requestData.get("symbol");
        Double getAmount = parseToDouble(requestData.get("amount"));
        Long walletId = ((Integer) requestData.get("walletID")).longValue();

        // Appeler le service pour sauvegarder la transaction
        transactionService.saveTransactionBuy(status, transactionType, cryptoSymbol, walletId, getAmount);

        // Créer une réponse JSON personnalisée
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Transaction created successfully");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }



}
