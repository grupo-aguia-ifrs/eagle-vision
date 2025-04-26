$(document).on('click', '#togglePassword', function () {
    const $password = $('#password');
    const $icon = $(this).find('i');
    const isVisible = $password.attr('type') === 'text';
  
    $password.attr('type', isVisible ? 'password' : 'text');
    $icon.toggleClass('fa-eye fa-eye-slash');
  });

  $(document).on('submit', '#loginForm', function (e) {
    e.preventDefault(); // impede o envio real do formulário

    const email = $('#email').val();
    const senha = $('#password').val();

    console.log('Email:', email);
    console.log('Senha:', senha);
  });