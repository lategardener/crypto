$(document).ready(function() {
    // Masquer les messages d'erreur au départ
    $('#submitButton').prop('disabled', true);

    let typingTimer;
    const typingDelay = 1200; // Délai en millisecondes (1.2 secondes)

    // Fonction pour valider les champs du formulaire
    function validateForm() {
        var lastname = $('#floatingLastname').val().trim();
        var firstname = $('#floatingFirstName').val().trim();
        var email = $('#floatingEmail').val().trim();
        var password = $('#floatingPassword').val().trim();

        var isFirstNameValid = validateFirstname(firstname);
        var isLastNameValid = validateLastname(lastname);
        var isEmailValid = validateEmail(email);
        var emailExists = $('#emailError').text() === "";
        var isPasswordValid = validatePassword(password);
        var isConditionChecked = $('#condition').is(':checked');

        // Activer/désactiver le bouton instantanément
        $('#submitButton').prop('disabled', !(isEmailValid && emailExists &&
            isPasswordValid && isConditionChecked &&
            isFirstNameValid && isLastNameValid));
    }

    // Validation du prénom avec interdiction des chiffres et mise en forme
    function validateFirstname(firstname) {
        // Retirer les chiffres et formater la première lettre en majuscule
        firstname = firstname.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s'-]/g, '');
        firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
        $('#floatingFirstName').val(firstname);

        if (firstname === "") {
            setTimeout(() => $('#firstnameError').text("Le prénom est requis").show(), typingDelay);
            return false;
        }
        if (firstname.length < 4 || firstname.length > 12) {
            setTimeout(() => $('#firstnameError').text("Doit contenir entre 4 et 12 caractères").show(), typingDelay);
            return false;
        } else {
            $('#firstnameError').text("").show();
            return true;
        }
    }

    // Validation du nom avec interdiction des chiffres et mise en majuscules
    function validateLastname(lastname) {
        // Retirer les chiffres et forcer en majuscules
        lastname = lastname.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s'-]/g, '').toUpperCase();
        $('#floatingLastname').val(lastname);

        if (lastname === "") {
            setTimeout(() => $('#lastnameError').text("Le nom est requis").show(), typingDelay);
            return false;
        }
        if (lastname.length < 4 || lastname.length > 12) {
            setTimeout(() => $('#lastnameError').text("Doit contenir entre 4 et 12 caractères").show(), typingDelay);
            return false;
        } else {
            $('#lastnameError').text("").show();
            return true;
        }
    }

    // Validation du mot de passe avec délai pour l'affichage des erreurs
    function validatePassword(password) {
        if (password === "") {
            setTimeout(() => $('#passwordError').text("Le mot de passe est requis").show(), typingDelay);
            return false;
        }

        var lengthValid = password.length >= 8 && password.length <= 25;
        var uppercaseValid = /[A-Z]/.test(password);
        var lowercaseValid = /[a-z]/.test(password);
        var digitValid = /\d/.test(password);

        if (!lengthValid) {
            setTimeout(() => $('#passwordError').text("Doit contenir entre 8 et 25 caractères").show(), typingDelay);
            return false;
        } else if (!uppercaseValid || !lowercaseValid || !digitValid) {
            setTimeout(() => $('#passwordError').text("Doit contenir au moins une majuscule, une minuscule et un chiffre").show(), typingDelay);
            return false;
        } else {
            $('#passwordError').text("").show();
            return true;
        }
    }

    // Validation de l'email avec délai pour l'affichage des erreurs
    function validateEmail(email) {
        if (email === "") {
            setTimeout(() => $('#emailError').text("L'email est requis").show(), typingDelay);
            return false;
        }
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setTimeout(() => $('#emailError').text("L'email est invalide").show(), typingDelay);
            return false;
        } else {
            $('#emailError').text("").show();
            return true;
        }
    }

    // Fonction de temporisation pour la saisie des erreurs
    function startTypingTimer(callback) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(callback, typingDelay);
    }

    // Gestion des événements de saisie pour les champs
    $('#floatingFirstName').on('input', function() {
        startTypingTimer(() => {
            validateFirstname($(this).val().trim());
        });
        validateForm(); // Valider le formulaire immédiatement
    });

    $('#floatingLastname').on('input', function() {
        startTypingTimer(() => {
            validateLastname($(this).val().trim());
        });
        validateForm(); // Valider le formulaire immédiatement
    });

    $('#floatingEmail').on('input', function() {
        const email = $(this).val().trim();
        if (email) {
            startTypingTimer(() => {
                validateEmail(email);
                checkEmailExistence(email);
            });
        } else {
            $('#emailError').text("").show();
            validateForm(); // Valider le formulaire immédiatement
        }
    });

    $('#floatingPassword').on('input', function() {
        startTypingTimer(() => {
            validatePassword($(this).val().trim());
        });
        validateForm(); // Valider le formulaire immédiatement
    });

    // Toggle de visibilité du mot de passe
    $('#togglePassword').on('click', function() {
        const passwordField = $('#floatingPassword');
        const passwordFieldType = passwordField.attr('type');
        const icon = $(this).find('i');

        if (passwordFieldType === 'password') {
            passwordField.attr('type', 'text');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
            icon.addClass('active'); // Ajoute la classe active à l'icône
        } else {
            passwordField.attr('type', 'password');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
            icon.removeClass('active'); // Enlève la classe active
        }
    });

    // Écouteur pour la case à cocher
    $('#condition').on('change', function() {
        validateForm(); // Valider le formulaire immédiatement
    });

    // Soumission finale
    $('#form').on('submit', function(e) {
        e.preventDefault();
        validateForm();
        if (!$('#submitButton').is(':disabled')) {
            this.submit();
        }
    });
});
