function updatePriceChanges() {
    // First, update the prices
    fetch('/crypto/updatePrice', {
        method: 'PUT'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating prices');
            }
            console.log('Prices updated');
        })
        .then(() => {
            // Second, update the price changes
            return fetch('/crypto/updatePriceChangePercent', {
                method: 'PUT'
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating price changes');
            }
            console.log('Price changes updated');
        })
        .then(() => {
            // After updating prices and changes, fetch all cryptocurrencies
            return fetch('/crypto/api/cryptos/getAll');
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            return response.json(); // We expect a JSON response here
        })
        .then(data => {
            console.log('Updated data:', data);
            data.forEach(crypto => {
                // Format values to 2 decimal places
                const formattedPrice = parseFloat(crypto.currentPrice).toFixed(2);
                const formattedChange = parseFloat(crypto.priceChangePercent).toFixed(2);

                // Update the text and color of the price change element
                const priceElement = document.getElementById(`price-change-${crypto.symbol}`);
                if (priceElement) {
                    priceElement.textContent = formattedChange + '%';
                    priceElement.style.color = formattedChange >= 0 ? 'green' : 'red';
                }

                // Update the text of the price display element
                const priceDisplay = document.getElementById(`crypto-price-${crypto.symbol}`);
                if (priceDisplay) {
                    priceDisplay.textContent = '$' + formattedPrice;
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Call immediately on page load
    updatePriceChanges();

    // Call every 1 second
    setInterval(updatePriceChanges, 1000);
});
