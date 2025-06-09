$(document).on('click', '#togglePassword', function () {
    const $password = $('#password');
    const $icon = $(this).find('i');
    const isVisible = $password.attr('type') === 'text';
  
    $password.attr('type', isVisible ? 'password' : 'text');
    $icon.toggleClass('fa-eye fa-eye-slash');
  });

  $(document).on('submit', '#loginForm', function (e) {
    e.preventDefault(); // impede o envio real do formulário

    let email = $('#email').val();
    let senha = $('#password').val();

    // $.post('/api/login/', {
    //   usuario: email,
    //   senha: senha
    // }, function(data) {
    //   if (data.success) {
    //     window.location.href = 'ListagemDados.html';  // ou qualquer página protegida
    //   } else {
    //     alert(data.message);
    //   }
    // });

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:8000/api/login/", // ← Isso aqui tem que bater certinho
      data: {
        usuario: email,
        senha: senha
      },
      success: function(resposta) {
        if (resposta.success) {
          window.location.href = "ListagemDados.html";
        } else {
          alert(resposta.message);
        }
      }
    });

    console.log('Email:', email);
    console.log('Senha:', senha);
  });