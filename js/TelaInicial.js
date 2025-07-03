$(document).ready(function() {
    console.log("jQuery está carregado e o DOM está pronto!");

    // Botão de Usuário
    var userButton = $('#userButton');
    if (userButton.length) {
        console.log("Botão #userButton encontrado!");
        userButton.on('click', function() {
            console.log("Botão de usuário clicado!");
            window.location.href = 'ListagemDados.html';
        });
    } else {
        console.error("Botão #userButton NÃO encontrado. Verifique o ID no HTML.");
    }

    // Botão Sair
    var logoutButton = $('#logoutButton');
    if (logoutButton.length) {
        console.log("Botão #logoutButton encontrado!");
        logoutButton.on('click', function() {
            console.log("Botão Sair clicado! Redirecionando para login.html");
            
            window.location.href = 'login.html';
        });
    } else {
        console.error("Botão #logoutButton NÃO encontrado. Verifique o ID no HTML.");
    }
});