document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('typeText');
    const cardNumberElement = document.getElementById('cardNumber');
    const cardHolderInput = document.getElementById('typeName');
    const cardHolderElement = document.getElementById('holderName');
    const expirationInput = document.getElementById('typeExp');
    const expirationElement = document.getElementById('expiration');
    const cvvInput = document.getElementById('typeText2');
    const cvvElement = document.getElementById('cvv');

    // Mise à jour de l'affichage du numéro de carte
    cardNumberInput.addEventListener('input', function() {
        let input = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
        let formattedInput = '____ ____ ____ ____';

        for (let i = 0; i < input.length; i++) {
            formattedInput = formattedInput.substring(0, i + Math.floor(i / 4)) + input[i] + formattedInput.substring(i + Math.floor(i / 4) + 1);
        }

        cardNumberElement.textContent = formattedInput;
        cardNumberInput.value = input.replace(/(.{4})/g, '$1 ').trim();
    });

    // Empêcher la saisie de caractères non numériques pour le numéro de carte
    cardNumberInput.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    // Mise à jour du nom du titulaire de la carte
    cardHolderInput.addEventListener('input', function() {
        let input = cardHolderInput.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 12); // Limite à 12 caractères, lettres uniquement
        cardHolderElement.textContent = input;
        cardHolderInput.value = input;
    });

    // Mise à jour de la date d'expiration
    expirationInput.addEventListener('input', function() {
        let input = expirationInput.value.replace(/\D/g, '').slice(0, 4);
        let formattedInput = '__/__';

        for (let i = 0; i < input.length; i++) {
            if (i < 2) {
                formattedInput = formattedInput.substring(0, i) + input[i] + formattedInput.substring(i + 1);
            } else {
                formattedInput = formattedInput.substring(0, i + 1) + input[i] + formattedInput.substring(i + 2);
            }
        }

        expirationElement.textContent = formattedInput;
        expirationInput.value = input.length === 4 ? input.slice(0, 2) + '/' + input.slice(2) : input;
    });

    // Empêcher la saisie de caractères non numériques pour la date d'expiration
    expirationInput.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    // Mise à jour du CVV
    cvvInput.addEventListener('input', function() {
        let input = cvvInput.value.replace(/\D/g, '').slice(0, 3);
        let formattedInput = '___';

        for (let i = 0; i < input.length; i++) {
            formattedInput = formattedInput.substring(0, i) + input[i] + formattedInput.substring(i + 1);
        }

        cvvElement.textContent = formattedInput;
    });

    // Empêcher la saisie de caractères non numériques pour le CVV
    cvvInput.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    // Retourner la carte lors de la saisie du CVV
    cvvInput.addEventListener('focus', function() {
        document.querySelector('.card-inner').classList.add('flipped');
    });

    // Remettre la carte en place après la saisie du CVV
    cvvInput.addEventListener('blur', function() {
        document.querySelector('.card-inner').classList.remove('flipped');
    });
});
