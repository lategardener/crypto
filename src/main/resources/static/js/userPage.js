document.addEventListener('DOMContentLoaded', () => {
    let previousTotalValue = 0; // Variable pour stocker la valeur précédente du total

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
        new Chart(ctx, {
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
            if(percentage == 0.00){
                arrow = ''; // Pas de flèche
                color = 'gray';
            }
            else{
                arrow = '▲'; // Flèche vers le haut
                color = 'green';
                percentage = `+${percentage}`
            }
        } else if (previousTotalValue > 0 && totalValue < previousTotalValue) {
            // Diminution
            percentage = ((totalValue - previousTotalValue) / previousTotalValue * 100).toFixed(2);
            if(percentage == 0.00){
                arrow = ''; // Pas de flèche
                color = 'gray';
                percentage = '0.00';
            }
            else{
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

    // Première récupération de la valeur dès le chargement de la page
    fetchTotalValue().then(totalValue => {
        updateTotalValueDisplay(totalValue);  // Affiche immédiatement la valeur totale
    });

    // Mettre à jour la valeur toutes les 3 secondes sans redessiner le graphique
    setInterval(() => {
        fetchTotalValue().then(totalValue => {
            updateTotalValueDisplay(totalValue);  // Met à jour la valeur totale
        });
    }, 3000);  // Met à jour toutes les 3 secondes
});
