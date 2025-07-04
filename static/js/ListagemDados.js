$(document).ready(function() {
    let clientesData = [];
    let cftvData = [];
    let alarmeData = [];
    let camerasData = [];
    const itemsPerPage = 10;
    let currentPage = 1;
    let totalItems = 0;
    let totalPages = 0;
    let activeFilters = {
        search: '',
        camera: false,
        alarm: false
    };

    // Função para buscar clientes
    async function fetchClientes() {
        try {
            const response = await fetch('http://localhost:8000/api/cliente');
            if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            return [];
        }
    }

    // Função para buscar CFTVs
    async function fetchCftvs() {
        try {
            const response = await fetch('http://localhost:8000/api/cftvs/');
            if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar CFTVs:', error);
            return [];
        }
    }

    // Função para buscar alarmes
    async function fetchAlarmes() {
        try {
            const response = await fetch('http://localhost:8000/api/alarmes/');
            if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar alarmes:', error);
            return [];
        }
    }

    // Função para buscar Câmeras
    async function fetchCameras() {
        try {
            const response = await fetch('http://localhost:8000/api/cameras/');
            if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar Câmeras:', error);
            return [];
        }
    }

    // Função para filtrar os dados
    function filterData(data) {
        return data.filter(item => {
            // Filtro de pesquisa
            const matchesSearch = item.codigo.toLowerCase().includes(activeFilters.search.toLowerCase()) || 
                                (item.nome_fantasia || '').toLowerCase().includes(activeFilters.search.toLowerCase());
            
            // Filtro de câmera ativa
            const matchesCamera = !activeFilters.camera || cftvData.some(c => c.cliente === item.id);
            // Filtro de alarme ativo
            const matchesAlarm = !activeFilters.alarm || alarmeData.some(a => a.id_cliente === item.id);
            
            return matchesSearch && matchesCamera && matchesAlarm;
        });
    }

    // Função para exibir os dados na tabela
    function displayData(data) {
        $('tbody').empty();
        if (!data || data.length === 0) {
            $('tbody').append('<tr><td colspan="3">Nenhum cliente encontrado</td></tr>');
        } else {
            data.forEach(item => {
                // Verifica se existe CFTV e Alarme para o cliente
                const cftvAtivo = cftvData.some(c => c.cliente === item.id);
                const alarmeAtivo = alarmeData.some(a => a.id_cliente === item.id);
                $('tbody').append(`
                    <tr>
                        <td>${item.codigo || ''}</td>
                        <td class="clickable-row" data-id="${item.id}">${item.nome_fantasia || ''}</td>
                        <td class="icon-cell">
                            <i class="fa-solid fa-camera icon camera${cftvAtivo ? ' active' : ''}"></i>
                            <i class="fas fa-bell icon alarm${alarmeAtivo ? ' active' : ''}"></i>
                        </td>
                    </tr>
                `);
            });
        }
    }

    // Função para carregar os dados
    async function loadData() {
        clientesData = await fetchClientes();
        cftvData = await fetchCftvs();
        alarmeData = await fetchAlarmes();
        camerasData = await fetchCameras();
        const filteredData = filterData(clientesData);
        totalItems = filteredData.length;
        totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        } else if (totalPages === 0) {
            currentPage = 1;
        }
        
        displayData(filteredData);
        updatePagination();
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

    // Evento de clique apenas no nome fantasia para abrir o modal e preencher os dados
    $(document).on('click', '.clickable-row', function() {
        const id = $(this).data('id');
        const cliente = clientesData.find(c => c.id === id);
        const cftv = cftvData.find(c => c.cliente === id);
        const alarme = alarmeData.find(a => a.id_cliente === id);

        if (cliente) {
            $("#modal-nome-fantasia").html(`Nome fantasia: <strong>${cliente.nome_fantasia}</strong>`);
            $("#modal-codigo").html(`Código: <strong>${cliente.codigo}</strong>`);
            $("#modal-nome-responsavel").html(`Nome completo do responsável: <strong>${cliente.nome_responsavel || ''}</strong>`);
            $("#modal-telefone-responsavel").html(`Telefone do responsável: <strong>${cliente.telefone_responsavel || ''}</strong>`);
        }

        if (cftv) {
            $("#modal-modelo-cftv").html(`Modelo da câmera: <strong>${cftv.modelo_cftv || ''}</strong>`);
            $("#modal-ip-cftv").html(`IP cadastrado: <strong>${cftv.ip_externo || ''}</strong>`);
            $("#modal-cloud-cftv").html(`Cloud do NVR: <strong>${cftv.cloud_cftv || ''}</strong>`);
            $("#modal-usuario-cftv").html(`Usuário cadastrado: <strong>${cftv.grup_pessoas || ''}</strong>`);
            // Buscar senha da primeira câmera do cliente
            const camerasDoCliente = camerasData.filter(cam => cam.cftv === id);
            const senha = camerasDoCliente.length > 0 ? camerasDoCliente[0].senha : '';
            $("#passwordText").text('********').data('senha', senha || '');
            $('#togglePassword').removeClass('fa-eye').addClass('fa-eye-slash');
            // Preencher quantidade de câmeras
            const qtdCameras = camerasDoCliente.length;
            $("#modal-qtd-cftv").html(`Quantidade de câmeras instaladas: <strong>${qtdCameras}</strong>`);
        } else {
            $("#modal-modelo-cftv").html(`Modelo da câmera: <strong></strong>`);
            $("#modal-ip-cftv").html(`IP cadastrado: <strong></strong>`);
            $("#modal-cloud-cftv").html(`Cloud do NVR: <strong></strong>`);
            $("#modal-usuario-cftv").html(`Usuário cadastrado: <strong></strong>`);
            $("#passwordText").text('********').data('senha', '');
            $('#togglePassword').removeClass('fa-eye').addClass('fa-eye-slash');
            $("#modal-qtd-cftv").html(`Quantidade de câmeras instaladas: <strong></strong>`);
        }

        // Preencher campos do alarme
        if (alarme) {
            $("#modal-modelo-alarme").html(`Modelo da central: <strong>${alarme.modelo_central || ''}</strong>`);
            $("#modal-sensores-alarme").html(`Sensores instalados: <strong>${alarme.sensores_instalados || ''}</strong>`);
            $("#modal-usuarios-alarme").html(`Usuários cadastrados na central: <strong>${(alarme.grup_pessoas || '').replace(/\n/g, ' ')}</strong>`);
        } else {
            $("#modal-modelo-alarme").html(`Modelo da central: <strong></strong>`);
            $("#modal-sensores-alarme").html(`Sensores instalados: <strong></strong>`);
            $("#modal-usuarios-alarme").html(`Usuários cadastrados na central: <strong></strong>`);
        }

        $('#modalDescricao').modal('show');
    });

    $(document).on('click', '#togglePassword', function () {
        const $password = $('#passwordText');
        const $icon = $(this);
        const senhaReal = $password.data('senha') || '';
        const isHidden = $password.text().includes('*');
        if (isHidden) {
            $password.text(senhaReal);
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
        } else {
            $password.text('********');
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
        }
    });

    let logoutButton = $('#logoutButton');
    if (logoutButton.length) {
        logoutButton.on('click', function() {
            window.location.href = 'TelaInicial.html';
        });
    } else {
        console.error("Botão #logoutButton NÃO encontrado. Verifique o ID no HTML.");
    }

    // Carregar dados iniciais
    loadData();
});