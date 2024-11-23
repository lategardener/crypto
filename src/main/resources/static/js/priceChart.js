function changeCrypto(element) {
    // Récupère le symbole et l'image de la crypto sélectionnée
    const selectedCryptoSymbol = element.querySelector('span').textContent;
    const selectedCryptoImage = element.querySelector('img').src;

    // Met à jour le bouton avec la crypto sélectionnée (le symbole et l'image)
    document.getElementById('selectedCryptoSymbol').textContent = selectedCryptoSymbol;
    document.getElementById('selectedCryptoImage').src = selectedCryptoImage;

    // Appeler la fonction pour mettre à jour le prix et la balance de la crypto
    updateCryptoDetails(selectedCryptoSymbol);
}

function updateCryptoDetails(selectedCryptoSymbol) {

    // Récupérer le prix de la crypto
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
        .then(response => {
            console.log('Réponse du serveur pour la balance:', response);
            return response.json();
        })
        .then(data => {
            console.log('Données de balance reçues:', data);
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


function changeReceiveCrypto(element) {
    // Récupérer les données de la crypto sélectionnée
    const selectedCryptoName = element.querySelector('span').textContent;
    const selectedCryptoImage = element.querySelector('img').src;

    // Mettre à jour le bouton de la section "Recevoir" avec la crypto sélectionnée
    document.getElementById('selectedReceiveCryptoName').textContent = selectedCryptoName;
    document.getElementById('selectedReceiveCryptoImage').src = selectedCryptoImage;
}

