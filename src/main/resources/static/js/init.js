$(document).ready(function() {
    $('#submitButton').prop('disabled', true);

    let typingTimer;
    const typingDelay = 1200;

    function validateForm() {
        var lastname = $('#floatingLastname').val().trim();
        var firstname = $('#floatingFirstName').val().trim();
        var email = $('#floatingEmail').val().trim();
        var password = $('#floatingPassword').val().trim();

        var isLastnameValid = validateLastname(lastname);
        var isFirstnameValid = validateFirstname(firstname);
        var isEmailValid = validateEmail(email);
        var emailExists = $('#emailError').text() === "";
        var isPasswordValid = validatePassword(password);
        var isConditionChecked = $('#condition').is(':checked');

        $('#submitButton').prop('disabled', !(isLastnameValid && isFirstnameValid && isEmailValid && emailExists && isPasswordValid && isConditionChecked));
    }

    // Validation et transformation du Lastname en majuscule en temps réel
    function validateLastname(lastname) {
        lastname = lastname.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s'-]/g, '').toUpperCase(); // Conversion directe en majuscule à chaque frappe
        $('#floatingLastname').val(lastname); // Mettre à jour la valeur du champ

        if (lastname === "") {
            $('#lastnameError').text("Le nom est requis").show();
            return false;
        }
        if (lastname.length < 3 || lastname.length > 15) {
            $('#lastnameError').text("Doit contenir entre 3 et 15 caractères").show();
            return false;
        } else {
            $('#lastnameError').text("").hide();
            return true;
        }
    }

    // Validation et transformation du Firstname (première lettre en majuscule et le reste en minuscule) en temps réel
    function validateFirstname(firstname) {
        firstname = firstname.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s'-]/g, ''); // Supprimer les caractères invalides
        firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(); // Première lettre en majuscule, le reste en minuscule
        $('#floatingFirstName').val(firstname); // Mettre à jour la valeur du champ

        if (firstname === "") {
            $('#firstnameError').text("Le prénom est requis").show();
            return false;
        }
        if (firstname.length < 3 || firstname.length > 20) {
            $('#firstnameError').text("Doit contenir entre 3 et 20 caractères").show();
            return false;
        } else {
            $('#firstnameError').text("").hide();
            return true;
        }
    }

    // Validation de l'email
    function validateEmail(email) {
        if (email === "") {
            $('#emailError').text("").show();
            return false;
        }
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            $('#emailError').text("Email invalide").show();
            return false;
        } else {
            return true;
        }
    }

    // Validation du mot de passe
    function validatePassword(password) {
        if (password === "") {
            $('#passwordError').text("").show();
            return false;
        }

        var lengthValid = password.length >= 8 && password.length <= 25;
        var uppercaseValid = /[A-Z]/.test(password);
        var lowercaseValid = /[a-z]/.test(password);
        var digitValid = /\d/.test(password);

        if (!lengthValid) {
            $('#passwordError').text("Doit contenir entre 8 et 25 caractères").show();
            return false;
        } else if (!uppercaseValid || !lowercaseValid || !digitValid) {
            $('#passwordError').text("Doit contenir au moins une majuscule, une minuscule et un chiffre").show();
            return false;
        } else {
            $('#passwordError').text("").hide();
            return true;
        }
    }

    // Vérification de l'existence de l'email
    function checkEmailExistence(email) {
        const isEmailValid = validateEmail(email);
        if (!isEmailValid) {
            $('#emailError').text("").hide();
            $('#submitButton').prop('disabled', true);
            return;
        }

        $.ajax({
            url: '/user/checkEmail',
            method: 'POST',
            data: { email: email },
            success: function(exists) {
                if (exists) {
                    $('#emailError').text("Cet email est déjà utilisé").show();
                    $('#submitButton').prop('disabled', true);
                } else {
                    $('#emailError').text("").hide();
                    validateForm();
                }
            },
            error: function() {
                $('#emailError').text("Une erreur s'est produite lors de la vérification").show();
            }
        });
    }

    function startTypingTimer(callback) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(callback, typingDelay);
    }

    $('#floatingFirstName').on('input', function() {
        validateFirstname($(this).val().trim());
        validateForm();
    });

    $('#floatingLastname').on('input', function() {
        validateLastname($(this).val().trim());
        validateForm();
    });

    $('#floatingEmail').on('input', function() {
        const email = $(this).val().trim();
        if (email) {
            validateEmail(email);
            checkEmailExistence(email);
        } else {
            $('#emailError').text("").hide();
            validateForm();
        }
    });

    $('#floatingPassword').on('input', function() {
        validatePassword($(this).val().trim());
        validateForm();
    });

    $('#togglePassword').on('click', function() {
        const passwordField = $('#floatingPassword');
        const passwordFieldType = passwordField.attr('type');
        const icon = $(this).find('i');

        if (passwordFieldType === 'password') {
            passwordField.attr('type', 'text');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
            icon.addClass('active');
        } else {
            passwordField.attr('type', 'password');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
            icon.removeClass('active');
        }
    });

    $('#condition').on('change', function() {
        validateForm();
    });

    // Générer une image de signe aléatoire
    var randomImageIndex = Math.floor(Math.random() * 11); // Math.random() génère un nombre entre 0 et 1, *11 le rend entre 0 et 10
    var imgElement = document.getElementById("userImage");
    imgElement.src = "/img/img_" + randomImageIndex + ".png"; // Charge l'image aléatoire
});
