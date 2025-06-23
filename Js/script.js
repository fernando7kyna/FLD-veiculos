document.addEventListener("DOMContentLoaded", function () {
    // Cadastro
    const registerForm = document.querySelector('body.cadastro .login-form');
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            if (name && email && password) {
                // Simples armazenamento local. Em um projeto real, isso seria uma chamada de API.
                localStorage.setItem("user_name", name);
                localStorage.setItem("user_email", email);
                localStorage.setItem("user_password", password);

                alert("Cadastro realizado com sucesso!");
                window.location.href = "login.html";
            } else {
                alert("Por favor, preencha todos os campos!");
            }
        });
    }

    // Login
    const loginForm = document.querySelector('body.login .login-form');
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            // Em um projeto real, isso seria uma chamada de API para verificar as credenciais.
            let storedEmail = localStorage.getItem("user_email");
            let storedPassword = localStorage.getItem("user_password");

            if (email === storedEmail && password === storedPassword) {
                alert("Login bem-sucedido!");
                window.location.href = "carros.html";
            } else {
                alert("E-mail ou senha incorretos!");
            }
        });
    }

    // Carregar carros e ativar filtros na página de carros
    if (document.getElementById('container-carros')) {
        carregarCarros();
        document.querySelectorAll('select, #busca').forEach(el => {
            el.addEventListener('input', aplicarFiltros);
        });
    }

    // Scroll Header
    window.onscroll = function () {
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            if (window.scrollY > 50) {
                headerContent.classList.add('scrolled');
            } else {
                headerContent.classList.remove('scrolled');
            }
        }
    };
});


let carros = [];

async function carregarCarros() {
    try {
        const res = await fetch('carros.json');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        carros = await res.json();
        preencherFiltros();
        mostrarCarros(carros);
    } catch (error) {
        console.error("Erro ao carregar os dados dos carros:", error);
        const container = document.getElementById('container-carros');
        if (container) {
            container.innerHTML = `<p style="color: #ff4d4d; text-align: center;">Não foi possível carregar os carros. Verifique o console para mais detalhes.</p>`;
        }
    }
}

function preencherFiltros() {
    const cores = new Set();
    const tipos = new Set();
    const precos = new Set();
    const anos = new Set();
    const transmissoes = new Set();

    carros.forEach(carro => {
        cores.add(carro.cor);
        tipos.add(carro.tipo);
        precos.add(carro.preco <= 25000 ? "Até $25k" : carro.preco <= 40000 ? "$25k - $40k" : "Acima de $40k");
        anos.add(carro.ano);
        transmissoes.add(carro.transmissao);
    });

    preencherSelect('filter-color', [...cores], 'Cor');
    preencherSelect('filter-type', [...tipos], 'Tipo');
    preencherSelect('filter-price', [...precos], 'Preço');
    preencherSelect('filter-year', [...anos].sort((a, b) => b - a), 'Ano');
    preencherSelect('filter-transmission', [...transmissoes], 'Transmissão');
}

function preencherSelect(id, opcoes, textoPadrao) {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = '';

    const optionPadrao = document.createElement('option');
    optionPadrao.value = '';
    optionPadrao.textContent = textoPadrao;
    select.appendChild(optionPadrao);

    opcoes.forEach(op => {
        const option = document.createElement('option');
        option.value = op;
        option.textContent = op;
        select.appendChild(option);
    });
}

function mostrarCarros(lista) {
    const container = document.getElementById('container-carros');
    if (!container) return;

    container.innerHTML = '';
    lista.forEach(carro => {
        const card = document.createElement('div');
        card.className = 'carro-card';
        card.innerHTML = `
            <img src="${carro.imagem}" alt="${carro.modelo}">
            <div class="carro-info">
                <h2>${carro.modelo}</h2>
                <p><strong>${carro.preco.toLocaleString('pt-BR', {
            style: 'currency', currency: 'BRL'
        })}</strong></p>
                <p class="detalhes-carro">
                    <span>${carro.ano}</span>
                    <span class="separador">•</span>
                    <span>${carro.cor}</span>
                    <span class="separador">•</span>
                    <span>${carro.transmissao}</span>
                </p>
            </div>
            <div class="contato">Entrar em contato</div>
        `;
        container.appendChild(card);
    });
      if (lista.length <=4) {
        container.style.fontSize = '17px';
        container.style.gap = '10px';
        container.querySelectorAll('.carro-card').forEach(card => {
            card.style.width = '280px';
             card.style.height =  '350px';
            card.style.padding = '20px';
        });
        document.body.style.minHeight = '90vh';
    } else {
        container.style.fontSize = '';
        container.style.gap = '';
        container.querySelectorAll('.carro-card').forEach(card => {
            card.style.width = '';
            card.style.padding = '';
        });
        document.body.style.minHeight = '';
    }
}

function aplicarFiltros() {
    const cor = document.getElementById('filter-color')?.value;
    const tipo = document.getElementById('filter-type')?.value;
    const preco = document.getElementById('filter-price')?.value;
    const ano = document.getElementById('filter-year')?.value;
    const transmissao = document.getElementById('filter-transmission')?.value;
    const busca = document.getElementById('busca')?.value.toLowerCase();

    const filtrados = carros.filter(c => {
        return (!cor || c.cor === cor) &&
            (!tipo || c.tipo === tipo) &&
            (!preco || (preco === "Até $25k" && c.preco <= 25000) ||
                (preco === "$25k - $40k" && c.preco > 25000 && c.preco <= 40000) ||
                (preco === "Acima de $40k" && c.preco > 40000)) &&
            (!ano || c.ano == ano) &&
            (!transmissao || c.transmissao === transmissao) &&
            (!busca || c.modelo.toLowerCase().includes(busca));
    });

    mostrarCarros(filtrados);
}

// Scroll Animation
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});

