// Déclaration des variables globales
let cardNumberInput, cardHolderInput, amountInput;

document.addEventListener("DOMContentLoaded", () => {
    // Initialisation des variables après le chargement du DOM
    cardNumberInput = document.getElementById('typeText');
    cardHolderInput = document.getElementById('typeName');
    amountInput = document.getElementById('cryptoAmount');
    const submitButton = document.getElementById('submitPurchaseBtn');

    // Attacher les événements
    submitButton.addEventListener('click', handleWithdraw);

    // Validation de l'input quantité
    amountInput.addEventListener("input", function () {
        validateAmount(this);
    });

    // Empêcher la saisie de caractères non numériques pour le numéro de carte
    cardNumberInput.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    // Mise à jour du nom du titulaire de la carte
    cardHolderInput.addEventListener('input', function() {
        let input = cardHolderInput.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 12); // Limite à 12 caractères, lettres uniquement
        cardHolderInput.value = input;
    });

});

// Validation et formatage de la valeur saisie dans le champ quantité
function validateAmount(input) {
    input.value = input.value.replace(/[^0-9.]/g, ''); // Supprime les caractères non numériques
    if ((input.value.match(/\./g) || []).length > 1) { // Limite à un seul point décimal
        input.value = input.value.slice(0, -1);
    }
    if (input.value.replace('.', '').length > 20) { // Limite à 20 chiffres maximum
        input.value = input.value.slice(0, 20);
    }
}

// Gérer le retrait
async function handleWithdraw(event) {
    event.preventDefault();

    // Vérifier si les variables sont correctement définies
    if (!cardNumberInput || !cardHolderInput || !amountInput) {
        console.error("Les champs du formulaire ne sont pas correctement initialisés.");
        return;
    }

    const cardNumber = cardNumberInput.value.replace(/\s/g, ''); // Enlever les espaces
    const cardHolder = cardHolderInput.value.trim();
    const amount = parseFloat(amountInput.value);

    // Validation des champs
    if (!cardNumber || !cardHolder || !amount || isNaN(amount)) {
        showError('Veuillez remplir tous les champs correctement.');
        return;
    }

    try {
        console.log("Début du processus de retrait.");

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
            account.holderName === cardHolder // Vérifiez l'expiration si nécessaire
        );

        if (!matchingAccount) {
            console.error("Aucun compte correspondant trouvé.");
            showError('Les informations de la carte ne correspondent à aucun compte.');
            return;
        }

        // Mettre à jour le solde du compte
        const updatedBalance = matchingAccount.balance + amount;
        console.log(`Solde mis à jour pour le compte ID=${matchingAccount.id} : Nouveau solde = ${updatedBalance}`);
        await fetch(`/bankAccount/updateBalance/${matchingAccount.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ balance: updatedBalance })
        });

        // Mettre à jour les holdings crypto
        await fetch(`/cryptoHolding/deductAmount?walletId=${walletId}&cryptoSymbol=${"USDC"}&newQuantity=${amount}`, {
            method: "PUT",
        });

        // Créer la transaction
        const transactionData = {
            status: "Completed",
            transactionType: "Withdraw",
            amount: parseFloat(-amount),
            symbol: "USDC",
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
            text: `Retrait de ${amount} € effectué avec succès.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Réinitialiser le formulaire
        cardNumberInput.value = '';
        cardHolderInput.value = '';
        amountInput.value = '';
    } catch (error) {
        console.error("Erreur lors du processus de retrait :", error.message);
        showError(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    }

    // Après que le retrait ait été effectué
    const usdcAmountSpan = document.getElementById('usdcAmount');
    if (usdcAmountSpan) {
        let currentAmount = parseFloat(usdcAmountSpan.innerText.trim());
        const newAmount = currentAmount - amount;  // Calculer la nouvelle quantité
        usdcAmountSpan.innerText = newAmount;  // Mettre à jour l'affichage avec la nouvelle quantité
    }

}

// Afficher un message d'erreur
function showError(message) {
    Swal.fire({
        title: 'Erreur',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}
