document.addEventListener('DOMContentLoaded', () => {
    let previousTotalValue = 0; // Variable pour stocker la valeur précédente du total
    let cryptoPriceHistory = {}; // Objet pour stocker les prix historiques de chaque crypto
    let cryptoCharts = {}; // Objet pour stocker les instances des graphiques
    const MAX_POINTS = 30; // Limite maximale de points de données
    const COLORS = ['#8e44ad', '#f39c12', '#e74c3c', '#16a085', '#3498db', '#2ecc71', '#e74c3c', '#2980b9', '#f39c12', '#c0392b']; // Liste de couleurs
    const COLORS2 = ['#8e44ad', '#f39c12', '#3498db', '#2ecc71', '#e74c3c', '#c0392b']; // Liste de couleurs
    const ALPHA = 0.2; // Opacité des couleurs pour le remplissage
    let cryptoPieChart = null; // Variable pour stocker l'instance du graphique en forme de beignet

    // Exporter les fonctions pour qu'elles soient accessibles globalement
    window.fetchUpdatedCryptoHoldings = fetchUpdatedCryptoHoldings;
    window.updateOrCreateCryptoChart = updateOrCreateCryptoChart;


    // Fonction pour choisir une couleur aléatoire avec opacité
    function getRandomColorWithAlpha() {
        const randomIndex = Math.floor(Math.random() * COLORS2.length);
        const color = COLORS2[randomIndex];

        // Retirer la couleur sélectionnée de la liste
        COLORS2.splice(randomIndex, 1);

        const rgbaColor = color.replace('#', '').match(/.{2}/g); // Convertir la couleur hex en RGB
        const rgba = `rgba(${parseInt(rgbaColor[0], 16)}, ${parseInt(rgbaColor[1], 16)}, ${parseInt(rgbaColor[2], 16)}, ${ALPHA})`;
        return {
            fillColor: rgba, // Couleur RGBA pour le remplissage
            borderColor: color // Couleur originale pour le contour
        };
    }

    // Fonction pour mélanger un tableau
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Échange les éléments
        }
    }

    // Si cryptoHoldingsData est disponible, on génère le graphique
    if (cryptoHoldingsData && cryptoHoldingsData.length > 0) {
        const totalAmount = cryptoHoldingsData.reduce((sum, item) => sum + item.amount, 0);

        const sortedHoldings = cryptoHoldingsData.sort((a, b) => b.amount - a.amount);
        const topHoldings = sortedHoldings.slice(0, 4);
        const remainingHoldings = sortedHoldings.slice(4);
        const remainingTotal = remainingHoldings.reduce((sum, item) => sum + item.amount, 0);

        if (remainingHoldings.length > 0) {
            topHoldings.push({
                name: 'Others',
                amount: remainingTotal
            });
        }

        const labels = topHoldings.map(item => item.name);
        const amounts = topHoldings.map(item => item.amount);

        // Liste des couleurs
        let colors = ['#8e44ad', '#f39c12', '#e74c3c', '#16a085', '#3498db'];

        // Mélanger l'ordre des couleurs à chaque rechargement de la page
        shuffleArray(colors);

        // Création du graphique avec des rayons différents
        const ctx = document.getElementById('cryptoPieChart').getContext('2d');
        cryptoPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                cutout: '50%', // Pour ajuster l'épaisseur du cercle
                plugins: {
                    legend: {
                        display: false // Masquer la légende intégrée
                    }
                },
                elements: {
                    arc: {
                        borderRadius: (context) => {
                            const value = context.raw;
                            return (value / totalAmount) * 20; // Adapte ce facteur pour obtenir des différences visibles
                        }
                    }
                }
            }
        });

        const legendContainer = document.getElementById('cryptoLegend');
        topHoldings.forEach((item, index) => {
            const percentage = ((item.amount / totalAmount) * 100).toFixed(2) + '%';
            const legendItem = document.createElement('li');
            legendItem.innerHTML = `
                <span style="background-color: ${colors[index]}; width: 10px; height: 10px; display: inline-block; margin-right: 10px; border-radius: 50%;"></span>
                ${item.name} ${percentage}
            `;
            legendContainer.appendChild(legendItem);
        });
    } else {
        console.error("Aucune donnée de crypto holding disponible.");
    }

    // Fonction pour récupérer les cryptos depuis l'API
    function fetchAllCryptos() {
        return fetch('/crypto/api/cryptos/getAll') // L'URL qui récupère toutes les cryptos
            .then(response => response.json()) // On suppose que la réponse est en JSON
            .catch(error => {
                console.error("Erreur lors de la récupération des cryptos :", error);
            });
    }

    // Fonction pour récupérer les derniers prix d'une cryptomonnaie
    function fetchLastPrices(symbol, limit = 10) {
        return fetch(`/crypto/api/cryptos/getLastPrices?symbol=${symbol}&limit=${limit}`)
            .then(response => response.json())
            .catch(error => {
                console.error("Erreur lors de la récupération des derniers prix :", error);
                return [];
            });
    }

    // Fonction pour mettre à jour l'affichage des prix et des variations pour chaque crypto
    function updateCryptoPricesDisplay(allCryptos) {
        const cryptoCards = document.querySelectorAll('.card'); // Récupère toutes les cartes de crypto

        // Parcours des cartes de 0 à 3 (les 4 premières)
        for (let index = 0; index < 4; index++) {
            const card = cryptoCards[index]; // Carte actuelle
            const priceElement = card.querySelector(`p[id^="cryptoPrice"]`); // Sélection de l'élément de prix par son id

            // Sélectionner les spans pour la flèche et le pourcentage dans la carte
            const arrowElement = card.querySelector(`#arrow${index}`);   // Sélection de la flèche (ID fixe)
            const percentageElement = card.querySelector(`#percentage${index}`);  // Sélection du pourcentage (ID fixe)

            // Recherche de la crypto qui correspond à cette carte (par son nom)
            const cardTitle = card.querySelector('.card-title').textContent; // Récupère le nom de la crypto
            const matchingCrypto = allCryptos.find(crypto => crypto.name === cardTitle); // Cherche la crypto correspondante

            if (matchingCrypto) {
                // Initialiser cryptoPriceHistory[matchingCrypto.name] comme un tableau s'il n'existe pas
                if (!cryptoPriceHistory[matchingCrypto.name]) {
                    cryptoPriceHistory[matchingCrypto.name] = [];
                }

                // Ajouter l'ancien prix à l'historique
                if (cryptoPriceHistory[matchingCrypto.name].length >= MAX_POINTS) {
                    cryptoPriceHistory[matchingCrypto.name].shift(); // Supprimer le point le plus ancien
                }
                cryptoPriceHistory[matchingCrypto.name].push(matchingCrypto.currentPrice);

                // Mise à jour du prix
                priceElement.textContent = `$${matchingCrypto.currentPrice.toFixed(2)}`;

                // Mise à jour de la variation de prix avec la logique de flèches
                let priceChangePercent = matchingCrypto.priceChangePercent;
                let arrow = '';
                let color = '';

                // Si la variation est positive
                if (priceChangePercent > 0) {
                    arrow = '▲'; // Flèche vers le haut
                    color = 'green';
                    priceChangePercent = `+${priceChangePercent.toFixed(2)}%`;  // Ajout du + et du %
                }
                // Si la variation est négative
                else if (priceChangePercent < 0) {
                    arrow = '▼'; // Flèche vers le bas
                    color = 'red';
                    priceChangePercent = `${priceChangePercent.toFixed(2)}%`;  // Pas de + pour les négatifs, juste %
                }
                // Si la variation est nulle
                else {
                    arrow = ''; // Pas de flèche
                    color = 'gray';
                    priceChangePercent = '0.00%';  // 0% dans ce cas
                }

                // Mise à jour des éléments de variation (flèche et pourcentage)
                if (arrowElement && percentageElement) {
                    // Mise à jour de la flèche
                    arrowElement.textContent = arrow;

                    // Mise à jour du pourcentage avec le symbole %
                    percentageElement.textContent = priceChangePercent;

                    // Mise à jour des couleurs
                    arrowElement.style.color = color;
                    percentageElement.style.color = color;
                }

                // Mettre à jour le graphique d'évolution des prix
                updatePriceChart(index, matchingCrypto.name);
            }
        }
    }

    // Fonction pour générer le graphique d'évolution des prix
    function generatePriceChart(index, cryptoName) {
        const ctx = document.getElementById(`cryptoChart${index}`).getContext('2d');
        const priceData = cryptoPriceHistory[cryptoName];

        // Vérifier si priceData est un tableau
        if (!Array.isArray(priceData)) {
            console.error(`priceData for ${cryptoName} is not an array`);
            return;
        }

        const labels = priceData.map((_, i) => i + 1); // Utiliser les indices comme labels
        const colors = getRandomColorWithAlpha(); // Choisir une couleur aléatoire avec opacité

        cryptoCharts[`cryptoChart${index}`] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price Evolution',
                    data: priceData,
                    borderColor: colors.borderColor,
                    backgroundColor: colors.fillColor,
                    borderWidth: 1,
                    fill: true,
                    pointRadius: 0, // Enlever les points de la courbe
                    tension: 0.4 // Utiliser l'interpolation linéaire pour lisser les courbes
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 1000, // Durée de l'animation en millisecondes
                    easing: 'easeOutBounce' // Type d'animation
                }
            }
        });
    }

    // Fonction pour mettre à jour le graphique d'évolution des prix
    function updatePriceChart(index, cryptoName) {
        const chart = cryptoCharts[`cryptoChart${index}`];
        const priceData = chart.data.datasets[0].data;

        // Vérifier si priceData est un tableau
        if (!Array.isArray(priceData)) {
            console.error(`priceData for ${cryptoName} is not an array`);
            return;
        }

        const labels = priceData.map((_, i) => i + 1); // Utiliser les indices comme labels
        chart.data.labels = labels;
        chart.data.datasets[0].data = priceData;
        chart.update('none'); // Mettre à jour le graphique sans animer
    }

    // Fonction pour récupérer la valeur totale du portefeuille depuis l'API
    function fetchTotalValue() {
        return fetch('/user/api/total-value') // Ton API qui retourne la valeur totale
            .then(response => response.json())
            .catch(error => {
                console.error("Erreur lors de la récupération de la valeur totale : ", error);
                return 0;  // Retourne 0 en cas d'erreur
            });
    }

    // Fonction pour mettre à jour la valeur totale affichée
    function updateTotalValueDisplay(totalValue) {
        const totalValueElement = document.getElementById('totalValue');
        console.log(totalValue);
        totalValueElement.textContent = totalValue.toFixed(2) + " USD";

        // Vérification de l'augmentation ou de la diminution
        const valueChangeElement = document.getElementById('valueChange');
        const arrowElement = document.getElementById('arrow');
        const percentageElement = document.getElementById('percentage');

        let arrow = '';
        let percentage = 0;
        let color = '';

        // Comparaison avec la valeur précédente
        if (previousTotalValue > 0 && totalValue > previousTotalValue) {
            // Augmentation
            percentage = ((totalValue - previousTotalValue) / previousTotalValue * 100).toFixed(2);
            if (percentage == 0.00) {
                arrow = ''; // Pas de flèche
                color = 'gray';
            } else {
                arrow = '▲'; // Flèche vers le haut
                color = 'green';
                percentage = `+${percentage}`;
            }
        } else if (previousTotalValue > 0 && totalValue < previousTotalValue) {
            // Diminution
            percentage = ((totalValue - previousTotalValue) / previousTotalValue * 100).toFixed(2);
            if (percentage == 0.00) {
                arrow = ''; // Pas de flèche
                color = 'gray';
                percentage = '0.00';
            } else {
                arrow = '▼'; // Flèche vers le bas
                color = 'red';
            }
        } else {
            // Pas de changement
            arrow = ''; // Pas de flèche
            percentage = '0.00';
            color = 'gray';
        }

        // Mise à jour des éléments de flèche et pourcentage
        arrowElement.textContent = arrow;
        percentageElement.textContent = `${percentage}%`;
        percentageElement.style.color = color;
        arrowElement.style.color = color;

        // Mise à jour de la valeur précédente pour la comparaison suivante
        previousTotalValue = totalValue;
    }

    // Initialiser les graphiques avec les derniers prix
    fetchAllCryptos().then(allCryptos => {
        const cryptoCards = document.querySelectorAll('.card'); // Récupère toutes les cartes de crypto
        cryptoCards.forEach((card, index) => {
            const cardTitle = card.querySelector('.card-title').textContent; // Récupère le nom de la crypto
            const matchingCrypto = allCryptos.find(crypto => crypto.name === cardTitle); // Cherche la crypto correspondante
            if (matchingCrypto) {
                fetchLastPrices(matchingCrypto.symbol).then(lastPrices => {
                    cryptoPriceHistory[matchingCrypto.name] = lastPrices;
                    generatePriceChart(index, matchingCrypto.name);
                });
            }
        });
    });

    // Met à jour toutes les 3 secondes sans redessiner le graphique
    setInterval(() => {
        fetchTotalValue().then(totalValue => {
            updateTotalValueDisplay(totalValue);  // Met à jour la valeur totale
        });

        fetchAllCryptos().then(allCryptos => {
            updateCryptoPricesDisplay(allCryptos);  // Met à jour les prix des cryptos
        });

    }, 1000);  // Met à jour toutes les 1 seconde

    // Fonction pour créer ou mettre à jour le graphique
    function updateOrCreateCryptoChart(updatedHoldings) {
        // Vérifier si les données mises à jour sont valides
        if (!updatedHoldings || updatedHoldings.length === 0) {
            console.error("Aucune donnée de crypto holding disponible.");
            return;
        }

        const totalAmount = updatedHoldings.reduce((sum, item) => sum + item.amount, 0);

        const sortedHoldings = updatedHoldings.sort((a, b) => b.amount - a.amount);
        const topHoldings = sortedHoldings.slice(0, 4);
        const remainingHoldings = sortedHoldings.slice(4);
        const remainingTotal = remainingHoldings.reduce((sum, item) => sum + item.amount, 0);

        if (remainingHoldings.length > 0) {
            topHoldings.push({
                name: 'Others',
                amount: remainingTotal
            });
        }

        const labels = topHoldings.map(item => item.name);
        const amounts = topHoldings.map(item => item.amount);

        // Liste des couleurs
        let colors = ['#8e44ad', '#f39c12', '#e74c3c', '#16a085', '#3498db'];

        // Mélanger l'ordre des couleurs à chaque mise à jour
        shuffleArray(colors);

        // Vérifier si le graphique existe déjà
        const ctx = document.getElementById('cryptoPieChart').getContext('2d');

        if (cryptoPieChart) {
            // Si le graphique existe déjà, on le détruit avant de le recréer
            cryptoPieChart.destroy();
        }

        // Créer un nouveau graphique
        cryptoPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                cutout: '50%', // Pour ajuster l'épaisseur du cercle
                plugins: {
                    legend: {
                        display: false // Masquer la légende intégrée
                    }
                },
                elements: {
                    arc: {
                        borderRadius: (context) => {
                            const value = context.raw;
                            return (value / totalAmount) * 20; // Adapte ce facteur pour obtenir des différences visibles
                        }
                    }
                }
            }
        });

        // Mettre à jour la légende
        const legendContainer = document.getElementById('cryptoLegend');
        legendContainer.innerHTML = ''; // Vider la légende existante
        topHoldings.forEach((item, index) => {
            const percentage = ((item.amount / totalAmount) * 100).toFixed(2) + '%';
            const legendItem = document.createElement('li');
            legendItem.innerHTML = `
            <span style="background-color: ${colors[index]}; width: 10px; height: 10px; display: inline-block; margin-right: 10px; border-radius: 50%;"></span>
            ${item.name} ${percentage}
        `;
            legendContainer.appendChild(legendItem);
        });
    }

    // Fonction de confirmation d'échange
    document.getElementById('confirmExchange').addEventListener('click', async () => {
        const sendCryptoSymbol = document.getElementById('selectedCryptoSymbol').textContent;
        const sendAmount = parseFloat(document.getElementById('sendAmount').value);

        const sendBalanceText = document.getElementById('cryptoBalanceSend').textContent;
        const sendBalanceMatch = sendBalanceText.match(/Balance:\s*([\d.]+)\s*(\w+)/);
        const sendBalance = sendBalanceMatch ? parseFloat(sendBalanceMatch[1]) : NaN;
        const sendSymbol = sendBalanceMatch ? sendBalanceMatch[2] : '';

        const receiveCryptoSymbol = document.getElementById('selectedReceiveCryptoSymbol').textContent;
        const receiveAmount = parseFloat(document.getElementById('getAmount').value);

        const getBalanceText = document.getElementById('cryptoBalanceGet').textContent;
        const getBalanceMatch = getBalanceText.match(/Balance:\s*([\d.]+)\s*(\w+)/);
        const getBalance = getBalanceMatch ? parseFloat(getBalanceMatch[1]) : NaN;
        const getSymbol = getBalanceMatch ? getBalanceMatch[2] : '';

        if (!walletId || !sendCryptoSymbol || isNaN(sendAmount) || !receiveCryptoSymbol || isNaN(receiveAmount)) {
            Swal.fire("Erreur", "Données invalides pour l'échange", "error");
            return;
        }

        if (isNaN(sendBalance) || isNaN(getBalance)) {
            Swal.fire("Erreur", "Balances invalides.", "error");
            return;
        }

        // Afficher "Transaction en cours" pendant 3 secondes
        await Swal.fire({
            title: 'Transaction in Progress',
            text: 'Please wait...',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 3000,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Mise à jour des quantités dans le backend
            await fetch(`/cryptoHolding/deductAmount?walletId=${walletId}&cryptoSymbol=${sendCryptoSymbol}&newQuantity=${sendAmount}`, {
                method: "PUT",
            });

            await fetch(`/cryptoHolding/increaseAmount?walletId=${walletId}&cryptoSymbol=${receiveCryptoSymbol}&newQuantity=${receiveAmount}`, {
                method: "PUT",
            });

            // Récupérer et mettre à jour les données
            const updatedHoldings = await fetchUpdatedCryptoHoldings();
            if (updatedHoldings) {
                updateOrCreateCryptoChart(updatedHoldings);
            }

            // Mise à jour des soldes avec la fonction de formatage
            document.getElementById('cryptoBalanceSend').textContent = `Balance: ${formatTo8Digits(sendBalance - sendAmount)} ${sendSymbol}`;
            document.getElementById('cryptoBalanceGet').textContent = `Balance: ${formatTo8Digits(getBalance + receiveAmount)} ${getSymbol}`;

            // Réinitialiser les champs
            // Enregistrer la transaction dans le backend



            const transactionData = {
                status: "Completed",
                transactionType: "Exchange",
                sendCryptoSymbol: sendCryptoSymbol, // Identifiant ou symbole de la crypto envoyée
                receiveCryptoSymbol: receiveCryptoSymbol, // Identifiant ou symbole de la crypto reçue
                walletID: walletId,
                sendAmount: parseFloat(sendAmount),
                getAmount: parseFloat(receiveAmount),
            };
            await fetch('/transactions/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionData),
            });

            console.log(transactionData);


            document.getElementById('sendAmount').value = '';
            document.getElementById('getAmount').value = '';

            console.log("Transaction enregistrée avec succès");

            Swal.fire({
                title: 'Success!',
                text: 'Exchange successfully executed.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Erreur lors de l'échange:", error);

            Swal.fire({
                title: 'Erreur',
                text: 'Une erreur est survenue lors de l\'échange. Veuillez réessayer.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });



    function formatTo8Digits(number) {
        const numStr = number.toString(); // Convertir en chaîne
        const parts = numStr.split('.'); // Séparer la partie entière et la partie décimale
        const integerPart = parts[0]; // Partie entière
        const decimalPart = parts[1] || ''; // Partie décimale (ou vide si absente)

        // Calculer les caractères restants pour la partie décimale
        const remainingDigits = 8 - integerPart.length;

        if (remainingDigits > 0) {
            // Garder la partie entière et tronquer la partie décimale
            return parseFloat(integerPart + '.' + decimalPart.slice(0, remainingDigits));
        } else {
            // Si la partie entière dépasse ou égale 8 chiffres, tronquer la partie entière
            return parseFloat(integerPart.slice(0, 8));
        }
    }





    async function fetchUpdatedCryptoHoldings(walletID) {
        try {
            // Remplacez l'URL par l'endpoint réel de votre API
            const response = await fetch(`/wallet/api/wallet/${walletID}`);

            // Vérifier si la réponse de l'API est valide
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données du portefeuille');
            }

            // Récupérer le portefeuille en tant qu'objet
            const wallet = await response.json();
            console.log(wallet);
            console.log(wallet.cryptoHoldings);

            // Assurez-vous que le portefeuille contient la propriété "cryptos" (ou ce que vous utilisez dans votre réponse)
            return wallet.cryptoHoldings;
        } catch (error) {
            console.error("Erreur lors de la récupération des données du portefeuille:", error);
            return null;
        }
    }



});
