function updatePriceChanges() {
    setInterval(() => {
        // Premièrement, mettre à jour les prix
        fetch('/crypto/updatePrice', {
            method: 'PUT'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour des prix');
                }
                console.log('Prix mis à jour');
            })
            .then(() => {
                // Deuxièmement, mettre à jour les variations de prix
                return fetch('/crypto/updatePriceChangePercent', {
                    method: 'PUT'
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour des variations');
                }
                console.log('Variations de prix mises à jour');
            })
            .then(() => {
                // Après avoir mis à jour les prix et variations, récupérer toutes les cryptos
                return fetch('/crypto/api/cryptos/getAll');
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }
                return response.json(); // Ici, on s'attend à un JSON de données
            })
            .then(data => {
                console.log('Données mises à jour :', data);
                data.forEach(crypto => {
                    // Formater les valeurs pour avoir 2 décimales
                    const formattedPrice = parseFloat(crypto.currentPrice).toFixed(2);
                    const formattedChange = parseFloat(crypto.priceChangePercent).toFixed(2);

                    // Mettre à jour le texte et la couleur de l'élément de variation de prix
                    const priceElement = document.getElementById(`price-change-${crypto.symbol}`);
                    if (priceElement) {
                        priceElement.textContent = formattedChange + '%';
                        priceElement.style.color = formattedChange >= 0 ? 'green' : 'red';
                    }

                    // Mettre à jour le texte de l'élément de prix
                    const priceDisplay = document.getElementById(`crypto-price-${crypto.symbol}`);
                    if (priceDisplay) {
                        priceDisplay.textContent = '$' + formattedPrice;
                    }
                });
            })
            .catch(error => {
                console.error('Erreur :', error);
            });
    }, 1000); // Appel toutes les secondes
}

document.addEventListener('DOMContentLoaded', updatePriceChanges);
