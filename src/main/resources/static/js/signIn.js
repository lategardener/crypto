$(document).ready(function () {
    $('#submitButton').click(function (event) {
        event.preventDefault(); // Empêche l'envoi du formulaire classique

        // Collecte les données du formulaire
        const formData = {
            email: $('#floatingEmail').val(),
            password: $('#floatingPassword').val()
        };

        // Envoi de la requête AJAX
        $.ajax({
            url: '/user/validate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response === 'valid') {
                    window.location.href = '/user/dashboard'; // Redirige si les infos sont valides
                } else {
                    $('#inputError').text('Invalid email or password');
                }
            },
            error: function () {
                $('#inputError').text('Invalid email or password');
            }
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
