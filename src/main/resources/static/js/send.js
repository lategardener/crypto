let symbol = "";
let cryptoPrice = 0;

document.addEventListener("DOMContentLoaded", () => {
    const cryptoSelect = document.querySelector("#cryptoSelect");
    const selectedCryptoDiv = document.querySelector("#selectedCrypto");
    const cryptoAmountInput = document.querySelector("#cryptoAmount");
    const calculatedPriceInput = document.querySelector("#calculatedPrice");
    const submitButton = document.getElementById("submitSendBtn");

    let selectedCrypto = null;

    // Gérer le clic sur une option du menu déroulant
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            selectedCrypto = this.dataset.crypto;
            symbol = selectedCrypto;
            cryptoPrice = parseFloat(this.dataset.amount);

            console.log(`Crypto sélectionnée : ${symbol}, Prix : ${cryptoPrice}`);

            // Mettre à jour le bouton avec le nom de la crypto choisie
            cryptoSelect.textContent = this.textContent;
            cryptoSelect.classList.remove("btn-secondary");
            cryptoSelect.classList.add("btn-primary");

            // Mettre à jour l'affichage de la crypto sélectionnée
            selectedCryptoDiv.textContent = `Selected: ${selectedCrypto} (Amount owned: $${cryptoPrice})`;

            // Activer le champ amount si une crypto est sélectionnée
            cryptoAmountInput.disabled = false;
            cryptoAmountInput.value = '';  // Réinitialiser la valeur
            calculatedPriceInput.value = '';  // Réinitialiser l'adresse

            validateForm(); // Revalider le formulaire après la sélection
        });
    });

    // Validation en temps réel sur les champs d'entrée
    cryptoAmountInput.addEventListener("input", function () {
        validateAmount(this);
        validateForm();
    });

    calculatedPriceInput.addEventListener("input", validateForm);

    // Fonction pour valider le formulaire
    function validateForm() {
        const cryptoSelected = symbol !== ""; // Une crypto a été choisie
        const amountEntered = cryptoAmountInput.value.trim() !== ""; // Une quantité a été saisie
        const addressEntered = calculatedPriceInput.value.trim() !== ""; // Une adresse a été saisie

        // Activer ou désactiver le bouton en fonction des conditions
        submitButton.disabled = !(cryptoSelected && amountEntered && addressEntered);
    }

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

    // Gérer le clic sur le bouton d'envoi
    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();

        // Vérifiez si une quantité est saisie et valide
        const amountInputFloat = parseFloat(cryptoAmountInput.value);
        const recipientAddress = document.getElementById('calculatedPrice').value.trim();

        if (isNaN(amountInputFloat) || amountInputFloat <= 0) {
            Swal.fire({
                title: 'Erreur',
                text: 'Veuillez entrer une quantité valide.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Vérifiez si la quantité dépasse la balance
        if (amountInputFloat > cryptoPrice) {
            Swal.fire({
                title: 'Erreur',
                text: 'Solde insuffisant pour effectuer cette transaction.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            // Mettre à jour les holdings crypto pour l'expéditeur
            await fetch(`/cryptoHolding/deductAmount?walletId=${walletId}&cryptoSymbol=${symbol}&newQuantity=${amountInputFloat}`, {
                method: "PUT",
            });

            // Créer la transaction pour l'expéditeur
            const transactionData = {
                status: "Completed",
                transactionType: "Send",
                amount: parseFloat(-amountInputFloat),
                symbol: symbol,
                walletID: walletId,
            };
            console.log("Données de transaction (expéditeur) :", transactionData);

            const transactionResponse = await fetch('/transactions/transactionBuy/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData),
            });

            if (!transactionResponse.ok) {
                throw new Error(`Erreur lors de la création de la transaction : ${transactionResponse.status}`);
            }

            console.log('Transaction expéditeur créée avec succès');

            // Récupérer le wallet du destinataire
            let recipientWallet = null;
            const recipientResponse = await fetch(`/wallet/api/walletAddress/?address=${recipientAddress}`);

            if (recipientResponse.ok) {
                recipientWallet = await recipientResponse.json();
                console.log(`Wallet du destinataire trouvé : ${recipientWallet.id}`);
            } else {
                console.warn("Aucun wallet trouvé pour cette adresse. La transaction sera tout de même enregistrée comme réussie.");
            }

            // Si un wallet est trouvé, mettre à jour ses holdings et créer une transaction pour le destinataire
            if (recipientWallet) {
                await fetch(`/cryptoHolding/increaseAmount?walletId=${recipientWallet.id}&cryptoSymbol=${symbol}&newQuantity=${amountInputFloat}`, {
                    method: "PUT",
                });

                const recipientTransactionData = {
                    status: "Completed",
                    transactionType: "Receive",
                    amount: parseFloat(amountInputFloat),
                    symbol: symbol,
                    walletID: recipientWallet.id,
                };

                const recipientTransactionResponse = await fetch('/transactions/transactionBuy/create', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recipientTransactionData),
                });

                if (!recipientTransactionResponse.ok) {
                    console.warn(`Erreur lors de la création de la transaction pour le destinataire : ${recipientTransactionResponse.status}`);
                } else {
                    console.log("Transaction destinataire créée avec succès");
                }
            }

            // Fin de l'envoi
            Swal.fire({
                title: 'Succès',
                text: `Transaction réussie pour ${amountInputFloat} ${symbol}.`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur',
                text: "Une erreur est survenue lors du traitement de la transaction.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.error(error);
        }

        cryptoAmountInput.value = "";
        document.getElementById('calculatedPrice').value = "";

        if (typeof window.fetchUpdatedCryptoHoldings === "function") {
            const updatedHoldings = await window.fetchUpdatedCryptoHoldings(walletId);
            console.log(updatedHoldings);

            // Mettre à jour le menu déroulant avec les nouvelles données
            updateDropdownMenu(updatedHoldings);

            // Mettre à jour l'affichage de la crypto sélectionnée avec la nouvelle quantité
            const updatedCrypto = updatedHoldings.find(crypto => crypto.symbol === symbol);
            if (updatedCrypto) {
                selectedCryptoDiv.textContent = `Selected: ${symbol} (Amount owned: $${updatedCrypto.amount})`;
            }
        } else {
            console.error("La fonction fetchUpdatedCryptoHoldings n'est pas définie.");
        }
    });

    // Fonction pour mettre à jour le menu déroulant
    function updateDropdownMenu(updatedHoldings) {
        const dropdownMenu = document.querySelector(".dropdown-menu"); // Sélection du menu déroulant

        // Vider les anciennes options
        dropdownMenu.innerHTML = '';

        // Ajouter les nouvelles options
        updatedHoldings.forEach(crypto => {
            const option = document.createElement('a');
            option.classList.add('dropdown-item', 'd-flex', 'align-items-center');
            option.href = "#";
            option.setAttribute('data-crypto', crypto.symbol);
            option.setAttribute('data-amount', crypto.amount);

            // Ajouter le logo de la crypto
            const img = document.createElement('img');
            img.src = `https://cryptologos.cc/logos/${crypto.name.toLowerCase().replace(' ', '-')}-${crypto.symbol.toLowerCase()}-logo.png`;
            img.alt = `${crypto.name} Logo`;
            img.style.width = "20px";
            img.style.height = "20px";
            img.style.marginRight = "10px";

            // Ajouter le texte
            const span = document.createElement('span');
            span.textContent = `${crypto.name} (${crypto.symbol})`;

            // Ajouter l'image et le texte à l'option
            option.appendChild(img);
            option.appendChild(span);

            // Ajouter l'option au menu déroulant
            dropdownMenu.appendChild(option);
        });

        // Réattacher les événements aux nouveaux éléments du menu déroulant
        document.querySelectorAll(".dropdown-item").forEach(item => {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                selectedCrypto = this.dataset.crypto;
                symbol = selectedCrypto;
                cryptoPrice = parseFloat(this.dataset.amount);

                console.log(`Crypto sélectionnée : ${symbol}, Prix : ${cryptoPrice}`);

                // Mettre à jour le bouton avec le nom de la crypto choisie
                cryptoSelect.textContent = this.textContent;
                cryptoSelect.classList.remove("btn-secondary");
                cryptoSelect.classList.add("btn-primary");

                // Mettre à jour l'affichage de la crypto sélectionnée
                selectedCryptoDiv.textContent = `Selected: ${selectedCrypto} (Amount owned: $${cryptoPrice})`;

                // Activer le champ amount si une crypto est sélectionnée
                cryptoAmountInput.disabled = false;
                cryptoAmountInput.value = '';  // Réinitialiser la valeur
                calculatedPriceInput.value = '';  // Réinitialiser l'adresse

                validateForm(); // Revalider le formulaire après la sélection
            });
        });
    }
});
