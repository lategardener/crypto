document.addEventListener("DOMContentLoaded", function () {
    const maxEntries = 4;
    let transactionIdsList = []; // Liste pour stocker les IDs des transactions

    function fetchTransactions() {
        const idsUrl = `/transactions/wallet/${walletId}/transactions`; // Endpoint pour récupérer les IDs de transactions

        fetch(idsUrl)
            .then(response => response.json())
            .then(newTransactionIds => {
                if (newTransactionIds.length === 0) {
                    console.log("Aucune transaction trouvée.");
                    return;
                }

                // Trier les nouvelles transactions par ordre décroissant
                newTransactionIds.sort((a, b) => b - a);

                const tableBody = document.getElementById("transactions-table-body");

                // Vérifier les nouvelles transactions et les ajouter si elles ne sont pas déjà présentes
                newTransactionIds.forEach(transactionId => {
                    if (!transactionIdsList.includes(transactionId)) {
                        transactionIdsList.push(transactionId); // Ajouter l'ID à la liste

                        fetch(`/transactions/${transactionId}`)
                            .then(response => response.json())
                            .then(transaction => {
                                console.log("Transaction reçue :", transaction); // Debug

                                if (transaction.cryptoHoldings && Array.isArray(transaction.cryptoHoldings)) {
                                    transaction.cryptoHoldings.forEach(crypto => {
                                        fetch(`/transactions/${transactionId}/crypto/${crypto.id}/amount`)
                                            .then(response => response.json())
                                            .then(amount => {
                                                const row = document.createElement("tr");
                                                const logoUrl = `https://cryptologos.cc/logos/${crypto.name.toLowerCase().replace(' ', '-')}-${crypto.symbol.toLowerCase()}-logo.png`;

                                                const transactionTypeClass = transaction.transactionType === 'Exchange' ? 'transaction-type-exchange' : '';
                                                const statusClass = transaction.status === 'Completed' ? 'status-completed' : '';
                                                const amountClass = amount > 0 ? 'amount-positive' : 'amount-negative';

                                                console.log(`Transaction Type Class: ${transactionTypeClass}`);
                                                console.log(`Status Class: ${statusClass}`);
                                                console.log(`Amount Class: ${amountClass}`);

                                                row.innerHTML = `
                                                    <td class="${transactionTypeClass}">${transaction.transactionType}</td>
                                                    <td>${new Date(transaction.date).toLocaleString()}</td>
                                                    <td>${crypto.name}</td>
                                                    <td>${crypto.symbol}</td>
                                                    <td><img src="${logoUrl}" alt="Logo de ${crypto.name}" class="crypto-logo" style="width: 10%; height: auto;"></td>
                                                    <td class="${amountClass}">${(amount > 0 ? '+' : '') + amount}</td>
                                                    <td class="${statusClass}">${transaction.status}</td>
                                                `;

                                                // Ajouter la ligne à la table avec une transition fluide
                                                tableBody.prepend(row); // Ajoute en début de table (ordre décroissant)
                                                row.classList.add("added");  // Ajouter la classe pour l'animation

                                                // Limiter le nombre de lignes dans le tableau à 4
                                                const rows = tableBody.getElementsByTagName("tr");
                                                if (rows.length > maxEntries) {
                                                    tableBody.removeChild(rows[rows.length - 1]); // Supprimer la ligne la plus ancienne
                                                }
                                            })
                                            .catch(error => console.error("Erreur lors du chargement de la quantité pour crypto :", error));
                                    });
                                } else {
                                    console.warn("cryptoHoldings est vide ou non défini pour cette transaction :", transactionId);
                                }
                            })
                            .catch(error => console.error("Erreur lors du chargement de la transaction :", error));
                    }
                });
            })
            .catch(error => console.error("Erreur lors du chargement des transactions :", error));
    }

    // Appel initial
    fetchTransactions();

    // Rafraîchir toutes les 10 secondes
    setInterval(fetchTransactions, 1000); // 10000 ms = 10 secondes
});
