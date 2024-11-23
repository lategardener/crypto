


// Mettre à jour l'input de réception (getAmount) en fonction de l'input d'envoi

function updateReceiveAmount() {
    const priceFromCrypto = parseFloat(document.getElementById('cryptoPriceSend').textContent.split('= $')[1]);
    const priceToCrypto = parseFloat(document.getElementById('cryptoPriceGet').textContent.split('= $')[1]);
    const amountToSend = parseFloat(document.getElementById('sendAmount').value);

    if (!isNaN(amountToSend)) {
        const receivedAmount = amountToSend * (priceFromCrypto / priceToCrypto);
        document.getElementById('getAmount').value = receivedAmount.toFixed(8); // Limiter à 8 décimales
    }
}
// Attacher les événements pour la validation et la mise à jour en temps réel

document.getElementById('sendAmount').addEventListener('input', function () {
    const userBalance = parseFloat(document.getElementById('cryptoBalanceSend').textContent.split(' ')[1]);
    validateAndRestrictAmount('sendAmount', userBalance); // Validation du champ "sendAmount"
    toggleConfirmButton(); // Mettre à jour l'état du bouton

    // Mettre à jour l'input de réception
    updateReceiveAmount();
});
document.getElementById('selectedCryptoSymbol').addEventListener('change', toggleConfirmButton);

document.getElementById('selectedReceiveCryptoSymbol').addEventListener('change', toggleConfirmButton);
// Fonction pour changer la crypto dans la section "Envoyer"

function changeCrypto(element) {
    const selectedCryptoSymbol = element.querySelector('span').textContent;
    const selectedCryptoImage = element.querySelector('img').src;

    // Mettre à jour le bouton avec la crypto sélectionnée (le symbole et l'image)
    document.getElementById('selectedCryptoSymbol').textContent = selectedCryptoSymbol;
    document.getElementById('selectedCryptoImage').src = selectedCryptoImage;

    document.getElementById('sendAmount').value = ''; // Champ "Envoyer" réinitialisé
    document.getElementById('getAmount').value = '';

    console.log(("here"));
    // Appeler la fonction pour mettre à jour le prix et la balance de la crypto
    updateCryptoDetailsSend(selectedCryptoSymbol);

    // Vérifier l'état du bouton Exchange
    toggleConfirmButton();
}
// Fonction pour changer la crypto dans la section "Recevoir"

function changeReceiveCrypto(element) {
    const selectedCryptoSymbol = element.querySelector('span').textContent;
    const selectedCryptoImage = element.querySelector('img').src;

    // Mettre à jour le bouton de la section "Recevoir" avec la crypto sélectionnée
    document.getElementById('selectedReceiveCryptoSymbol').textContent = selectedCryptoSymbol;
    document.getElementById('selectedReceiveCryptoImage').src = selectedCryptoImage;

    // Réinitialiser les prix à zéro avant la mise à jour des données
    document.getElementById('sendAmount').value = ''; // Champ "Envoyer" réinitialisé
    document.getElementById('getAmount').value = '';

    // Appeler la fonction pour mettre à jour le prix et la balance de la crypto
    updateCryptoDetailsGet(selectedCryptoSymbol);

    // Vérifier l'état du bouton Exchange
    toggleConfirmButton();
}
// Mise à jour des informations de la crypto "Envoyer"

function updateCryptoDetailsSend(selectedCryptoSymbol) {
    fetch('/crypto/api/cryptos/getAll')
        .then(response => response.json())
        .then(data => {
            const selectedCrypto = data.find(crypto => crypto.symbol === selectedCryptoSymbol);
            if (selectedCrypto) {
                document.getElementById('cryptoPriceSend').textContent = `1 ${selectedCryptoSymbol} = $${selectedCrypto.currentPrice}`;
            } else {
                console.error('Crypto non trouvée');
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des cryptos:', error));

    const balanceApiUrl = `/cryptoHolding/getUserCryptoBalance?walletId=${walletId}&symbol=${selectedCryptoSymbol}`;

    fetch(balanceApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.amount !== undefined) {
                document.getElementById('cryptoBalanceSend').textContent = `Balance: ${data.amount} ${selectedCryptoSymbol}`;
            } else {
                console.error('Aucune balance trouvée');
            }
        })
        .catch(error => {
            console.error(`Erreur lors de la récupération de la balance pour l'URL: ${balanceApiUrl}`, error);
        });
}
// Mise à jour des informations de la crypto "Recevoir"

function updateCryptoDetailsGet(selectedCryptoSymbol) {
    fetch('/crypto/api/cryptos/getAll')
        .then(response => response.json())
        .then(data => {
            const selectedCrypto = data.find(crypto => crypto.symbol === selectedCryptoSymbol);
            if (selectedCrypto) {
                document.getElementById('cryptoPriceGet').textContent = `1 ${selectedCryptoSymbol} = $${selectedCrypto.currentPrice}`;
            } else {
                console.error('Crypto non trouvée');
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des cryptos:', error));

    const balanceApiUrl = `/cryptoHolding/getUserCryptoBalance?walletId=${walletId}&symbol=${selectedCryptoSymbol}`;

    fetch(balanceApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.amount !== undefined) {
                document.getElementById('cryptoBalanceGet').textContent = `Balance: ${data.amount} ${selectedCryptoSymbol}`;
            } else {
                console.error('Aucune balance trouvée');
            }
        })
        .catch(error => {
            console.error(`Erreur lors de la récupération de la balance pour l'URL: ${balanceApiUrl}`, error);
        });
}
// Fonction combinée pour activer/désactiver le bouton de confirmation

function toggleConfirmButton() {
    const sendCryptoSymbol = document.getElementById('selectedCryptoSymbol').textContent;
    const receiveCryptoSymbol = document.getElementById('selectedReceiveCryptoSymbol').textContent;

    const sendAmount = parseFloat(document.getElementById('sendAmount').value) || 0;
    const userBalance = parseFloat(document.getElementById('cryptoBalanceSend').textContent.split(' ')[1]);

    const confirmButton = document.getElementById('confirmExchange');

    // Vérifier si le montant est valide, la balance est suffisante et si les cryptos sont différentes
    if (sendAmount > 0 && sendAmount <= userBalance && sendCryptoSymbol !== receiveCryptoSymbol) {
        confirmButton.disabled = false;
        confirmButton.classList.add('btn-primary');
        confirmButton.classList.remove('deactivate');
    } else {
        confirmButton.disabled = true;
        confirmButton.classList.add('deactivate');
        confirmButton.classList.remove('btn-primary');
    }
}
// Fonction de validation et de restriction du montant
function validateAndRestrictAmount(inputId, maxBalance) {
    const inputElement = document.getElementById(inputId);
    let value = inputElement.value.replace(/[^0-9.]/g, '');

    // S'assurer qu'il n'y ait qu'un seul point décimal
    const pointCount = (value.match(/\./g) || []).length;
    if (pointCount > 1) value = value.slice(0, value.lastIndexOf('.'));

    // Limiter à 12 caractères
    if (value.length > 12) value = value.slice(0, 12);

    const amount = parseFloat(value);
    if (amount > maxBalance) value = maxBalance.toFixed(8);

    inputElement.value = value;
}
// Fonction d'échange des informations entre les sections "Envoyer" et "Recevoir"

document.getElementById('exchangeButton').addEventListener('click', function () {
    // Inverser les valeurs entre "Envoyer" et "Recevoir"
    const sendCryptoSymbolElement = document.getElementById('selectedCryptoSymbol');
    const receiveCryptoSymbolElement = document.getElementById('selectedReceiveCryptoSymbol');

    const tempSymbol = sendCryptoSymbolElement.textContent;
    sendCryptoSymbolElement.textContent = receiveCryptoSymbolElement.textContent;
    receiveCryptoSymbolElement.textContent = tempSymbol;

    const sendCryptoImageElement = document.getElementById('selectedCryptoImage');
    const receiveCryptoImageElement = document.getElementById('selectedReceiveCryptoImage');
    const tempImage = sendCryptoImageElement.src;
    sendCryptoImageElement.src = receiveCryptoImageElement.src;
    receiveCryptoImageElement.src = tempImage;

    const sendCryptoPriceElement = document.getElementById('cryptoPriceSend');
    const receiveCryptoPriceElement = document.getElementById('cryptoPriceGet');
    const tempPrice = sendCryptoPriceElement.textContent;
    sendCryptoPriceElement.textContent = receiveCryptoPriceElement.textContent;
    receiveCryptoPriceElement.textContent = tempPrice;

    const sendAmountElement = document.getElementById('sendAmount');
    const receiveAmountElement = document.getElementById('getAmount');
    const tempAmount = sendAmountElement.value;
    sendAmountElement.value = receiveAmountElement.value;
    receiveAmountElement.value = tempAmount;

    // Mettre à jour les informations sur les cryptos inversées
    updateCryptoDetailsSend(sendCryptoSymbolElement.textContent);
    updateCryptoDetailsGet(receiveCryptoSymbolElement.textContent);
});
// Initialiser le bouton de confirmation désactivé au chargement de la page





document.addEventListener('DOMContentLoaded', () => {
    toggleConfirmButton();
});

