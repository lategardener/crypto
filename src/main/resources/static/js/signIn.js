$(document).ready(function () {
    $(document).ready(function () {
        $('#submitButton').click(function (event) {
            event.preventDefault(); // Empêche l'envoi du formulaire classique

            // Collecte les données du formulaire
            const formData = {
                email: $('#floatingEmail').val(),
                password: $('#floatingPassword').val()
            };

            console.log(JSON.stringify(formData));

            // Envoi de la requête AJAX
            $.ajax({
                url: '/user/validate', // L'URL où les données seront envoyées
                type: 'POST',          // La méthode HTTP utilisée
                data: formData,        // Les données envoyées (sous forme de clé-valeur)
                success: function (response) {
                    // Code exécuté si la requête réussit
                    if (response === 'valid') {
                        window.location.href = '/user/dashboard'; // Redirection si l'authentification est valide
                    } else {
                        $('#inputError').text('Invalid email or password'); // Affiche un message d'erreur si invalide
                    }
                },
                error: function () {
                    // Code exécuté si la requête échoue
                    $('#inputError').text('Invalid email or password');
                }
            });
        });
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



    // Random image
    var randomImageIndex = Math.floor(Math.random() * 6); // Math.random() génère un nombre entre 0 et 1, *11 le rend entre 0 et 10
    var imgElement = document.getElementById("userImage");
    imgElement.src = "/img/sign_up/img_" + randomImageIndex + ".png"; // Charge l'image aléatoire

    // Reset error text
    const inputEmail = document.getElementById("floatingEmail");
    inputEmail.addEventListener("input", function() {
        $('#inputError').text('');
    });

    const inputPassword = document.getElementById("floatingPassword");
    inputPassword.addEventListener("input", function() {
        $('#inputError').text('');
    });
});
