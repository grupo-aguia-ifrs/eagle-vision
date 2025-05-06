$(document).ready(function() {
    const itemsPerPage = 10;
    let currentPage = 1;
    let totalItems = 0;
    let totalPages = 0;
    let activeFilters = {
        search: '',
        camera: false,
        alarm: false
    };

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

    // Função para filtrar os dados
    function filterData() {
        return dados.filter(item => {
            // Filtro de pesquisa
            const matchesSearch = item.id.toLowerCase().includes(activeFilters.search.toLowerCase()) || 
                                  item.nome.toLowerCase().includes(activeFilters.search.toLowerCase());
            
            // Filtro de câmera
            const matchesCamera = !activeFilters.camera || item.status.camera;
            
            // Filtro de alarme
            const matchesAlarm = !activeFilters.alarm || item.status.alarm;
            
            return matchesSearch && matchesCamera && matchesAlarm;
        });
    }

    // Função para carregar os dados
    function loadData() {
        const filteredData = filterData();
        totalItems = filteredData.length;
        totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Reset para a primeira página se a página atual não existir mais
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        } else if (totalPages === 0) {
            currentPage = 1;
        }
        
        displayData(filteredData);
        updatePagination();
    }

    // Função para exibir os dados
    function displayData(data) {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = data.slice(start, end);

        $('tbody').empty();
        
        if (pageData.length === 0) {
            $('tbody').append(`
                <tr>
                    <td colspan="3" class="no-results">Nenhum cliente encontrado</td>
                </tr>
            `);
        } else {
            pageData.forEach(item => {
                $('tbody').append(`
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.nome}</td>
                        <td class="icon-cell">
                            <i class="fa-solid fa-camera icon camera ${item.status.camera ? 'active' : ''}"></i>
                            <i class="fas fa-bell icon alarm ${item.status.alarm ? 'active' : ''}"></i>
                        </td>
                    </tr>
                `);
            });
        }
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
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            $('.pagination').append(`
                <button class="page-number">1</button>
                ${startPage > 2 ? '<span>...</span>' : ''}
            `);
        }

        for (let i = startPage; i <= endPage; i++) {
            $('.pagination').append(`
                <button class="page-number ${i === currentPage ? 'active' : ''}">${i}</button>
            `);
        }

        if (endPage < totalPages) {
            $('.pagination').append(`
                ${endPage < totalPages - 1 ? '<span>...</span>' : ''}
                <button class="page-number">${totalPages}</button>
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
        loadData();
    });

    $(document).on('click', '.prev-page', function() {
        if (currentPage > 1) {
            currentPage--;
            loadData();
        }
    });

    $(document).on('click', '.next-page', function() {
        if (currentPage < totalPages) {
            currentPage++;
            loadData();
        }
    });

    // Evento de pesquisa em tempo real
    $('.search-bar').on('input', function() {
        activeFilters.search = $(this).val();
        currentPage = 1; // Reset para a primeira página ao pesquisar
        loadData();
    });

    // Evento de clique nos filtros da sidebar
    $('.sidebar-btn.camera, .sidebar-btn.alarm').on('click', function() {
        const filterType = $(this).data('filter');
        activeFilters[filterType] = !activeFilters[filterType];
        $(this).toggleClass('active');
        currentPage = 1; // Reset para a primeira página ao filtrar
        loadData();
    });

    // Evento de clique no ícone do menu dentro do sidebar
    $('.sidebar-toggle').on('click', function() {
        $('.sidebar').addClass('hidden');
        $('.menu-toggle').removeClass('hidden');
        $('.container').addClass('shifted');
    });

    // Evento de clique no ícone do menu flutuante
    $('.menu-toggle').on('click', function() {
        $('.sidebar').removeClass('hidden');
        $(this).addClass('hidden');
        $('.container').removeClass('shifted');
    });

    // Carregar dados iniciais
    loadData();
});