let symbol = "";
let quantity = 0;

document.addEventListener("DOMContentLoaded", () => {
    const cryptoSelect = document.querySelector("#cryptoSelect");
    const selectedCryptoDiv = document.querySelector("#selectedCrypto");
    const cryptoAmountInput = document.querySelector("#cryptoAmount");
    const calculatedPriceInput = document.querySelector("#calculatedPrice");

    let selectedCrypto = null;
    let cryptoPrice = 0;

    // Gérer le clic sur une option du menu déroulant
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            selectedCrypto = this.dataset.crypto;
            symbol = selectedCrypto;
            cryptoPrice = parseFloat(this.dataset.price);

            console.log(`Crypto sélectionnée : ${symbol}, Prix : ${cryptoPrice}`);

            // Mettre à jour le bouton avec le nom de la crypto choisie
            cryptoSelect.textContent = `${this.textContent}`;
            cryptoSelect.classList.remove("btn-secondary");
            cryptoSelect.classList.add("btn-primary");

            // Mettre à jour l'affichage de la crypto sélectionnée
            selectedCryptoDiv.textContent = `Selected: ${selectedCrypto} (Price per unit: $${cryptoPrice.toFixed(2)})`;

            // Activer le champ amount si une crypto est sélectionnée
            cryptoAmountInput.disabled = false;
            cryptoAmountInput.value = '';  // Réinitialiser la valeur
            calculatedPriceInput.value = '';  // Réinitialiser le calcul du prix
        });
    });

    // Calculer le prix en fonction de la quantité saisie
    cryptoAmountInput.addEventListener("input", function () {
        validateAmount(this); // Validation de l'input avant de calculer
        const amount = parseFloat(this.value);
        if (!isNaN(amount) && selectedCrypto) {
            quantity = amount * cryptoPrice;
            console.log(`Quantité entrée : ${amount}, Prix calculé : ${quantity}`);
            calculatedPriceInput.value = `$${(amount * cryptoPrice).toFixed(2)}`;
        } else {
            calculatedPriceInput.value = "";
        }
    });
});

// Fonction pour valider et formater l'amount
function validateAmount(input) {
    input.value = input.value.replace(/[^0-9.]/g, '');
    if ((input.value.match(/\./g) || []).length > 1) {
        input.value = input.value.substring(0, input.value.length - 1);
    }
    if (input.value.replace('.', '').length > 15) {
        input.value = input.value.slice(0, 15);
    }
}

document.getElementById('submitPurchaseBtn').addEventListener('click', async function (event) {
    event.preventDefault();

    const cardNumberInput = document.getElementById('typeText');
    const cardHolderInput = document.getElementById('typeName');
    const expirationInput = document.getElementById('typeExp');
    const cvvInput = document.getElementById('typeText2');
    const amountInput = document.getElementById('cryptoAmount');

    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    const cardHolder = cardHolderInput.value.trim();
    const expirationDate = expirationInput.value.trim();
    const cvv = cvvInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!cardNumber || !cardHolder || !expirationDate || !cvv || !amount || isNaN(amount)) {
        console.error("Validation échouée : informations de carte ou montant manquants.");
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez remplir tous les champs correctement.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    try {
        console.log("Début du processus d'achat.");

        // Récupérer les comptes bancaires
        const bankAccountsResponse = await fetch(`/bankAccount/allBankAccounts/${userId}`);
        if (!bankAccountsResponse.ok) {
            throw new Error(`Erreur serveur : ${bankAccountsResponse.status} ${bankAccountsResponse.statusText}`);
        }
        const accountsText = await bankAccountsResponse.text();
        console.log('Réponse des comptes bancaires :', accountsText);
        const accounts = JSON.parse(accountsText);
        console.log("Comptes bancaires récupérés :", accounts);

        // Trouver un compte correspondant
        const matchingAccount = accounts.find(account =>
            account.accountNumber === cardNumber &&
            account.cvv === cvv &&
            account.holderName === cardHolder &&
            account.expirationDate === expirationDate
        );

        if (!matchingAccount) {
            console.error("Aucun compte correspondant trouvé.");
            Swal.fire({
                title: 'Erreur',
                text: 'Les informations de la carte ne correspondent à aucun compte.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (matchingAccount.balance < quantity) {
            console.error("Solde insuffisant : Solde actuel =", matchingAccount.balance, ", Montant requis =", quantity);
            Swal.fire({
                title: 'Erreur',
                text: 'Solde insuffisant pour effectuer cette transaction.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Mettre à jour le solde du compte
        const updatedBalance = matchingAccount.balance - quantity;
        console.log(`Solde mis à jour pour le compte ID=${matchingAccount.id} : Nouveau solde = ${updatedBalance}`);
        await fetch(`/bankAccount/updateBalance/${matchingAccount.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ balance: updatedBalance })
        });

        // Mettre à jour les holdings crypto
        await fetch(`/cryptoHolding/increaseAmount?walletId=${walletId}&cryptoSymbol=${symbol}&newQuantity=${amount}`, {
            method: "PUT",
        });

        // Créer la transaction
        const transactionData = {
            status: "Completed",
            transactionType: "Purchase",
            amount: parseFloat(amount),
            symbol: symbol,
            walletID: walletId,
        };
        console.log("Données de transaction :", transactionData);
        const transactionResponse = await fetch('/transactions/transactionBuy/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData),
        });
        if (!transactionResponse.ok) {
            throw new Error(`Erreur lors de la création de la transaction : ${transactionResponse.status}`);
        }
        const transactionText = await transactionResponse.text();
        console.log('Réponse de la transaction :', transactionText);
        const transaction = JSON.parse(transactionText);
        console.log("Transaction créée :", transaction);



        Swal.fire({
            title: 'Succès',
            text: `Achat effectué avec succès pour un montant de ${quantity.toFixed(2)} €`,
            icon: 'success',
            confirmButtonText: 'OK'
        });


        amountInput.value = '';
    } catch (error) {
        console.error("Erreur lors du processus d'achat :", error.message);
        Swal.fire({
            title: 'Erreur',
            text: error.message || 'Une erreur est survenue. Veuillez réessayer.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    const updatedHoldings = await fetchUpdatedCryptoHoldings();
    if (updatedHoldings) {
        updateOrCreateCryptoChart(updatedHoldings);
    }
});
