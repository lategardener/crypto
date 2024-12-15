// Fonction pour mettre à jour les informations des cryptos
function updateCryptos() {
    fetch('/crypto/api/cryptos/getAll')  // Appel à l'endpoint Spring pour récupérer les données des cryptos
        .then(response => response.json())
        .then(data => {
            // Mettre à jour les informations pour chaque crypto
            data.forEach(crypto => {
                // Trouver l'élément de la crypto dans le tableau par son ID
                const row = document.querySelector(`#crypto-row-${crypto.symbol}`);

                if (row) {
                    // Mettre à jour les éléments avec les nouvelles données
                    row.querySelector('.market-cap').innerText = crypto.marketCap;
                    row.querySelector('.price').innerText = crypto.currentPrice;
                    row.querySelector('.price-change').innerText = `${crypto.priceChangePercent}%`;
                    row.querySelector('.price-change').style.color = crypto.priceChangePercent >= 0 ? 'green' : 'red';
                }
            });
        })
        .catch(error => {
            console.error("Error fetching crypto data:", error);
        });
}

// Appel initial pour charger les données des cryptos
updateCryptos();

// Mise à jour des données toutes les secondes (1000 ms)
setInterval(updateCryptos, 1000);
