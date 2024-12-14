let symbol = "";
let usdcPrice = 1; // Initialiser avec une valeur par défaut
let totalPriceInUsdc = 0;


document.addEventListener("DOMContentLoaded", () => {
    // Sélection des éléments HTML
    const cryptoSelect = document.querySelector("#cryptoSelect");
    const selectedCryptoDiv = document.querySelector("#selectedCrypto");
    const cryptoAmountInput = document.querySelector("#cryptoAmount");
    const calculatedPriceInput = document.querySelector("#calculatedPrice");
    const submitButton = document.getElementById("submitSellBtn");
    const usdcPriceSpan = document.querySelector("#usdcPrice"); // Element où le prix USDC sera affiché

    let selectedCrypto = null;

    // Fonction pour récupérer le prix de l'USDC
    function fetchUsdcPrice() {
        fetch('/crypto/api/crypto/get/?symbol=USDC')  // Remplace par ton API pour récupérer le prix de l'USDC
            .then(response => response.json())
            .then(data => {
                usdcPrice = data.currentPrice; // Récupérer le prix de l'USDC
                console.log(usdcPrice);
                usdcPriceSpan.innerText = `${usdcPrice} $`; // Mettre à jour l'affichage
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du prix USDC:', error);
                usdcPriceSpan.innerText = 'Erreur'; // Afficher un message d'erreur en cas de problème
            });
    }

    // Initialiser le prix de l'USDC
    fetchUsdcPrice();

    // Mettre à jour le prix de l'USDC toutes les 10 secondes
    setInterval(fetchUsdcPrice, 15000);

    // Gérer la sélection de la crypto
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            selectedCrypto = this.dataset.crypto;
            cryptoAmount = this.dataset.amount;
            symbol = selectedCrypto;

            console.log(`Crypto sélectionnée : ${symbol}, Amount : ${cryptoAmount}`);

            // Mettre à jour le bouton avec le nom de la crypto choisie
            cryptoSelect.textContent = this.textContent;
            cryptoSelect.classList.remove("btn-secondary");
            cryptoSelect.classList.add("btn-primary");

            // Mettre à jour l'affichage de la crypto sélectionnée
            selectedCryptoDiv.textContent = `Selected: ${selectedCrypto} (Amount owned: $${cryptoAmount})`;

            // Activer le champ amount si une crypto est sélectionnée
            cryptoAmountInput.disabled = false;
            cryptoAmountInput.value = '';  // Réinitialiser la valeur
            calculatedPriceInput.value = '';  // Réinitialiser l'adresse

            // Revalider le formulaire après la sélection
            validateForm(); // Revalider après sélection
        });
    });

    // Calculer le prix en fonction de la quantité saisie et du prix de l'USDC
    cryptoAmountInput.addEventListener("input", async function () {
        validateAmount(this); // Validation de l'input avant de calculer
        const amount = parseFloat(this.value);

        if (!isNaN(amount) && selectedCrypto) {
            // Appel à votre API pour récupérer le prix de la crypto
            const response = await fetch(`/crypto/api/crypto/get/?symbol=${symbol}`);
            const data = await response.json();
            console.log(data);

            // Récupérer le prix de la crypto via .currentPrice
            const priceCrypto = data.currentPrice;

            if (priceCrypto) {
                // Calculer le prix total en USDC si le prix est trouvé
                totalPriceInUsdc = amount * priceCrypto * usdcPrice;
                console.log(`Quantité entrée : ${amount}, Prix de la crypto : ${priceCrypto}, Prix total : ${totalPriceInUsdc}`);
                calculatedPriceInput.value = `${totalPriceInUsdc}`;
            } else {
                calculatedPriceInput.value = "Erreur de récupération du prix";
            }
        } else {
            calculatedPriceInput.value = "";
        }

        // Revalider après chaque saisie dans le champ montant
        validateForm();
    });


    // Fonction pour valider le formulaire
    function validateForm() {
        const cryptoSelected = symbol !== ""; // Une crypto a été choisie
        const amountEntered = cryptoAmountInput.value.trim() !== ""; // Une quantité a été saisie

        // Activer ou désactiver le bouton en fonction des conditions
        submitButton.disabled = !(cryptoSelected && amountEntered);
    }

    // Validation et formatage de l'amount
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
        if (amountInputFloat > cryptoAmount) {
            Swal.fire({
                title: 'Erreur',
                text: 'Solde insuffisant pour effectuer cette transaction.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Confirmation de la vente
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to sell this cryptocurrency?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, sell it!'
        });

        // Si l'utilisateur confirme la vente
        if (result.isConfirmed) {
            try {
                // Mettre à jour les holdings crypto pour l'expéditeur
                await fetch(`/cryptoHolding/deductAmount?walletId=${walletId}&cryptoSymbol=${symbol}&newQuantity=${amountInputFloat}`, {
                    method: "PUT",
                });

                await fetch(`/cryptoHolding/increaseAmount?walletId=${walletId}&cryptoSymbol=${"USDC"}&newQuantity=${totalPriceInUsdc}`, {
                    method: "PUT",
                });

                // Créer la transaction pour l'expéditeur
                const transactionData = {
                    status: "Completed",
                    transactionType: "Sell",
                    sendAmount: parseFloat(amountInputFloat),
                    getAmount: totalPriceInUsdc,
                    sendCryptoSymbol: symbol,
                    receiveCryptoSymbol: "USDC",
                    walletID: walletId,
                };
                console.log("Données de transaction :", transactionData);

                const transactionResponse = await fetch('/transactions/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transactionData),
                });

                if (!transactionResponse.ok) {
                    throw new Error(`Erreur lors de la création de la transaction : ${transactionResponse.status}`);
                }

                console.log('Transaction  créée avec succès');

                const usdcOwnedSpan = document.querySelector('#usdcOwned');
                usdcOwnedSpan.innerText = `${totalPriceInUsdc}`; // Afficher le total price en USDC avec 2 décimales

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
                const updatedHoldings = await fetchUpdatedCryptoHoldings(walletId);
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

            // Afficher SweetAlert de succès après la vente
            Swal.fire(
                'Success!',
                'Your cryptocurrency has been sold successfully.',
                'success'
            );
        }
    });


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

    async function fetchUpdatedCryptoHoldings(walletID) {
        try {
            // Remplacez l'URL par l'endpoint réel de votre API
            const response = await fetch(`/cryptoHolding/api/getExchangeCryptos/${walletID}`);

            // Vérifier si la réponse de l'API est valide
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données du portefeuille');
            }

            // Récupérer le portefeuille en tant qu'objet
            const crypto = await response.json();
            console.log(crypto);

            // Assurez-vous que le portefeuille contient la propriété "cryptos" (ou ce que vous utilisez dans votre réponse)
            return crypto
        } catch (error) {
            console.error("Erreur lors de la récupération des données du portefeuille:", error);
            return null;
        }
    }
});



