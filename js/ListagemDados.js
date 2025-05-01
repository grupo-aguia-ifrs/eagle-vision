$(document).ready(function() {
    const itemsPerPage = 10;
    let currentPage = 1;
    let totalItems = 0;
    let totalPages = 0;

    // Dados estáticos
    const dados = [
        { id: '001', nome: 'Ferreira Lanches', status: { camera: false, alarm: false } },
        { id: '002', nome: 'Neltis Burger', status: { camera: true, alarm: false } },
        { id: '003', nome: 'Coprel Telecom', status: { camera: false, alarm: true } },
        { id: '004', nome: 'Indutar', status: { camera: true, alarm: true } },
        { id: '005', nome: 'Vence Tudo', status: { camera: false, alarm: false } },
        { id: '006', nome: 'AGCO', status: { camera: false, alarm: false } },
        { id: '007', nome: 'Casa do Chimarrão', status: { camera: true, alarm: false } },
        { id: '008', nome: 'Amisa', status: { camera: false, alarm: true } },
        { id: '009', nome: 'Lojão do Kiko', status: { camera: true, alarm: false } },
        { id: '010', nome: 'Oba Oba', status: { camera: false, alarm: false } },
        { id: '011', nome: 'IFRS', status: { camera: true, alarm: false } },
        { id: '012', nome: 'Geatel', status: { camera: false, alarm: true } },
        { id: '013', nome: 'Cachorrão do Tarcisio', status: { camera: true, alarm: false } },
        { id: '014', nome: 'Jotag', status: { camera: false, alarm: false } },
        { id: '015', nome: 'Gf Pneus', status: { camera: true, alarm: true} }
    ];

    // Função para carregar os dados
    function loadData() {
        totalItems = dados.length;
        totalPages = Math.ceil(totalItems / itemsPerPage);
        displayData();
        updatePagination();
    }

    // Função para exibir os dados
    function displayData() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = dados.slice(start, end);

        $('tbody').empty();
        pageData.forEach(item => {
            $('tbody').append(`
                <tr class="clickable-row" data-id="${item.id}">
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td class="icon-cell">
                        <i class="fas fa-video icon camera ${item.status.camera ? 'active' : ''}"></i>
                        <i class="fas fa-bell icon alarm ${item.status.alarm ? 'active' : ''}"></i>
                    </td>
                </tr>
            `);
        });
    }

    // Função para atualizar a paginação
    function updatePagination() {
        $('.pagination').empty();
        
        // Botão Anterior
        if (currentPage > 1) {
            $('.pagination').append(`
                <button class="prev-page"><i class="fas fa-chevron-left"></i></button>
            `);
        }

        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            $('.pagination').append(`
                <button class="page-number ${i === currentPage ? 'active' : ''}">${i}</button>
            `);
        }

        // Botão Próximo
        if (currentPage < totalPages) {
            $('.pagination').append(`
                <button class="next-page"><i class="fas fa-chevron-right"></i></button>
            `);
        }
    }

    // Eventos de clique na paginação
    $(document).on('click', '.page-number', function() {
        currentPage = parseInt($(this).text());
        displayData();
        updatePagination();
    });

    $(document).on('click', '.prev-page', function() {
        if (currentPage > 1) {
            currentPage--;
            displayData();
            updatePagination();
        }
    });

    $(document).on('click', '.next-page', function() {
        if (currentPage < totalPages) {
            currentPage++;
            displayData();
            updatePagination();
        }
    });

    // Evento de clique nos ícones
    // $(document).on('click', '.icon', function() {
    //     $(this).toggleClass('active');
    // });
    
    $(document).on('click', '.clickable-row', function() {
        const id = $(this).data('id');
        console.log(id);

        $('#modalDescricao').modal('show')
    });

    $(document).on('click', '#togglePassword', function () {
        const $password = $('#passwordText');
        const $icon = $(this);
        
        const isHidden = $password.text().includes('*');
    
        // Aqui você troca os valores fixos como quiser
        $password.text(isHidden ? 'minhasenha123' : '********');
        $icon.toggleClass('fa-eye-slash fa-eye');
    });
    

        
    loadData();
});