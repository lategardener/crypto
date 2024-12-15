document.addEventListener("DOMContentLoaded", function () {
    const maxEntries = 4;
    let lastMaxTransactionId = 0; // Stocker le plus grand ID de transaction

    // Fonction pour récupérer et afficher les transactions
    async function fetchTransactions() {
        const idsUrl = `/transactions/wallet/${walletId}/transactions`; // Endpoint pour récupérer les IDs des transactions

        try {
            const response = await fetch(idsUrl);
            const newTransactionIds = await response.json();

            if (newTransactionIds.length === 0) {
                console.log("Aucune transaction trouvée.");
                return;
            }

            // Affichage du tableau des IDs pour vérifier l'ordre reçu
            console.log("Nouveaux IDs de transaction :", newTransactionIds);

            // Trier les IDs par ordre décroissant
            newTransactionIds.sort((a, b) => b - a); // Trier par ID décroissant (si les IDs sont numériques)

            // Trouver le plus grand ID de la nouvelle liste de transactions
            const newMaxId = Math.max(...newTransactionIds);

            // Si le plus grand ID a changé, reconstruire la table
            if (newMaxId !== lastMaxTransactionId) {
                lastMaxTransactionId = newMaxId; // Mettre à jour le plus grand ID

                const tableBody = document.getElementById("transactions-table-body");

                // Compteur pour suivre le nombre d'entrées dans le tableau
                let transactionCount = tableBody.children.length;

                // Traitement des transactions dans l'ordre
                for (const transactionId of newTransactionIds) {
                    if (transactionCount >= maxEntries) {
                        break; // Arrêter si le tableau a déjà 4 transactions
                    }

                    const transactionResponse = await fetch(`/transactions/${transactionId}`);
                    const transaction = await transactionResponse.json();

                    if (transaction.cryptoHoldings && Array.isArray(transaction.cryptoHoldings)) {
                        console.log("Transaction reçue :", transaction); // Debug

                        for (const crypto of transaction.cryptoHoldings) {
                            const amountResponse = await fetch(`/transactions/${transactionId}/crypto/${crypto.id}/amount`);
                            const amount = await amountResponse.json();

                            const row = document.createElement("tr");
                            const logoUrl = `https://cryptologos.cc/logos/${crypto.name.toLowerCase().replace(' ', '-')}-${crypto.symbol.toLowerCase()}-logo.png`;

                            const transactionTypeClasses = {
                                'Exchange': 'transaction-type-exchange', // Bleu
                                'Sell': 'transaction-type-sell',        // Rouge
                                'Withdraw': 'transaction-type-withdraw', // Violet
                                'Send': 'transaction-type-send',        // Orange
                                'Receive': 'transaction-type-receive',
                                'Purchase': 'transaction-type-purchase' // Vert
                            };

                            const transactionTypeClass = transactionTypeClasses[transaction.transactionType] || '';

                            const statusClass = transaction.status === 'Completed' ? 'status-completed' : '';
                            const amountClass = amount > 0 ? 'amount-positive' : 'amount-negative';

                            row.innerHTML = `
                                <td class="${transactionTypeClass}">${transaction.transactionType}</td>
                                <td>${new Date(transaction.date).toLocaleString()}</td>
                                <td>${crypto.name}</td>
                                <td>${crypto.symbol}</td>
                                <td><img src="${logoUrl}" alt="Logo de ${crypto.name}" class="crypto-logo" style="width: 10%; height: auto;"></td>
                                <td class="${amountClass}">${(amount > 0 ? '+' : '') + amount}</td>
                                <td class="${statusClass}">${transaction.status}</td>
                            `;

                            // Ajouter la ligne à la table à la fin (ordre croissant)
                            tableBody.appendChild(row); // Ajoute en fin de table
                            row.classList.add("added");  // Ajouter la classe pour l'animation

                            // Incrémenter le compteur
                            transactionCount++;

                            if (transactionCount >= maxEntries) {
                                break; // Arrêter dès qu'on atteint la limite
                            }
                        }
                    } else {
                        console.warn("cryptoHoldings est vide ou non défini pour cette transaction :", transactionId);
                    }
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement des transactions :", error);
        }
    }

    // Appel initial
    fetchTransactions();

    // Rafraîchir toutes les 10 secondes
    setInterval(fetchTransactions, 1000); // 10000 ms = 10 secondes
});
