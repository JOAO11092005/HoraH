// --- SELETORES DO DOM ---
const cervejasContainer = document.getElementById("cerveja-cards");
const refrigerantesContainer = document.getElementById("refrigerante-cards");
const whiskysContainer = document.getElementById("whisky-cards");
const energeticosContainer = document.getElementById("energetico-cards");
const cachacasContainer = document.getElementById("cachaca-cards");

const carrinhoCheckout = document.querySelector(".carrinhoCheckout");
const mainPrincipal = document.querySelector("main");
const carrinhoComProdutos = document.querySelector(".carrinhoCheckout .produtos");
const carrinhoCount = document.querySelector(".carrinho .quantidade");
const valorTotalElement = document.getElementById("valorTotal");
const overlay = document.getElementById("overlay");
const btnPesquisar = document.getElementById("btnPesquisar");
const inputPesquisa = document.getElementById("pesquisa");
const selectCategoria = document.getElementById("categoria");
const btnPagamento = document.querySelector(".pagamento");

// --- MODAL PRODUTO ---
const produtoModal = document.getElementById("produtoModal");
const modalImg = document.getElementById("modal-img");
const modalNome = document.getElementById("modal-nome");
const modalDescricao = document.getElementById("modal-descricao");
const modalValor = document.getElementById("modal-valor");
const modalAddCarrinho = document.getElementById("modal-add-carrinho");

// --- ESTADO DA APLICAÇÃO ---
let carrinho = []; // Array de produtos no carrinho
let todosOsProdutos = []; // Array para guardar todos os produtos da API

// --- CONSTANTES ---
const NOME_LOJA = "Conveniência Hora H";
// ATENÇÃO: Coloque seu número de WhatsApp aqui com o código do país (ex: 5511999998888)
const WHATSAPP_NUMBER = "5511999998888"; 

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    adicionaListenersFiltro();
    adicionaListenerPagamento();
    adicionaEventosCarrinho(); 
    adicionaListenerOverlay();
    
    // **CORREÇÃO APLICADA AQUI**
    // Adiciona UM listener permanente ao botão do modal.
    adicionaListenerModalCart(); 
});

// --- CARREGAMENTO DE PRODUTOS ---

async function apiProdutos() {
    try {
        const url = await fetch('./src/json/produtos.json');
        if (!url.ok) throw new Error("Não foi possível carregar os produtos.");
        const response = await url.json();
        return response;
    } catch (error) {
        console.error("Erro ao buscar API:", error);
    }
}

async function carregarProdutos() {
    const response = await apiProdutos();
    if (!response) return;

    todosOsProdutos = [
        ...response.cervejas,
        ...response.refrigerantes,
        ...response.whisky,
        ...response.energeticos,
        ...response.cachacas
    ];

    produtos('cervejas', response.cervejas);
    produtos('refrigerantes', response.refrigerantes);
    produtos('whisky', response.whisky);
    produtos('energeticos', response.energeticos);
    produtos('cachacas', response.cachacas);
}

function produtos(tipo, produtoFinal) {
    let container;
    switch (tipo) {
        case 'cervejas': container = cervejasContainer; break;
        case 'refrigerantes': container = refrigerantesContainer; break;
        case 'whisky': container = whiskysContainer; break;
        case 'energeticos': container = energeticosContainer; break;
        case 'cachacas': container = cachacasContainer; break;
        default: console.warn(`Categoria não reconhecida: ${tipo}`); return;
    }
    criaCard(container, produtoFinal);
}

function criaCard(container, produtoFinal) {
    container.innerHTML = ''; 
    produtoFinal.forEach(resposta => {
        const { id, nome, valor, img, categoria, 'categoria_id': categoriaId } = resposta;

        const itemNoCarrinho = carrinho.find(item => item.id === id);
        const btnClasse = itemNoCarrinho ? 'adicionado' : '';
        const btnTexto = itemNoCarrinho ? 'Adicionado' : 'Adicionar ao carrinho';
        const btnDisabled = itemNoCarrinho ? 'disabled' : '';

        const produtoHTML = `
            <div class="produto" data-categoria-raw="${categoriaId}" data-nome="${nome.toLowerCase()}">
                <div class="clicavel-modal" onclick="abrirModalProduto(${id})">
                    <div class="img" title="${nome}"
                        style="background: url('${img}') center center no-repeat; background-size: contain;"></div>
                    <div class="info-produto">
                        <h3 class="nome-produto">${nome}</h3>
                        <p class="categoria" style="${getCategoriaColor(categoria)}" title="${getCategoriaTitle(categoria)}">${categoria}</p>
                        <h4 class="preco">Valor R$${valor.toFixed(2)}</h4>
                    </div>
                </div>
                <button class="btn-comprar ${btnClasse}" data-id="${id}" ${btnDisabled}>
                    ${btnTexto}
                </button>
            </div>
        `;
        container.innerHTML += produtoHTML;
    });

    container.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-comprar')) {
            const id = parseInt(e.target.dataset.id);
            const produto = todosOsProdutos.find(p => p.id === id);
            if (produto) {
                postCarrinho(produto, e.target);
            }
        }
    });
}


// --- FILTRO STICKY (Scroll) ---
window.addEventListener('scroll', () => {
    const filtro = document.querySelector('.filtro');
    const carrinhoIcon = document.querySelector(".carrinho");
    const logoEmpresa = document.querySelector(".logo-empresa");
    if (window.scrollY > 50) {
        filtro.classList.add('fixo');
        carrinhoIcon.classList.add('ativo');
        logoEmpresa.classList.add("ativo");
    } else {
        filtro.classList.remove('fixo');
        carrinhoIcon.classList.remove('ativo');
        logoEmpresa.classList.remove("ativo");
    }
});

// --- LÓGICA DO CARRINHO ---

function postCarrinho(produto, btnElement) {
    notificacao();

    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    if (btnElement && !btnElement.classList.contains('adicionado')) {
        btnElement.textContent = 'Adicionado';
        btnElement.classList.add('adicionado');
        btnElement.disabled = true;
    }

    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    
    if (totalItens > 0) {
        carrinhoCount.innerHTML = totalItens;
        carrinhoCount.classList.remove("off");
    } else {
        carrinhoCount.innerHTML = '0';
        carrinhoCount.classList.add("off");
    }
}

function abreCarrinho(response) {
    if (response === 'a') {
        carrinhoCheckout.style.display = 'flex';
        mainPrincipal.classList.add('blur'); 
        overlay.classList.add('ativo');
        renderizarItensCarrinho(); 
    }
    else if (response === 'f') {
        carrinhoCheckout.style.display = 'none';
        atualizarOverlayEBlur();
    }
}

function renderizarItensCarrinho() {
    if (carrinho.length === 0) {
        carrinhoComProdutos.innerHTML = '<p>Seu carrinho está vazio.</p>';
        valorTotalElement.textContent = '0.00';
        return;
    }

    carrinhoComProdutos.innerHTML = ''; 
    let totalGeral = 0;

    carrinho.forEach((item) => {
        const subtotal = item.valor * item.quantidade;
        totalGeral += subtotal;

        carrinhoComProdutos.innerHTML += `
            <div class="produtoCheckout" data-id="${item.id}">
                <div class="imgProduto" style="background: url('${item.img}') center center no-repeat; background-size: contain;"></div>
                <h2>${item.nome}</h2>
                <h3 class="preco-item">R$ ${subtotal.toFixed(2)}</h3>

                <div class="detalhes-produto">
                    <button class="qdButton aumentar" data-acao="aumentar">+</button>
                    <div class="quantidadeProduto">${item.quantidade}</div>
                    <button class="qdButton diminuir" data-acao="diminuir">-</button>
                </div>

                <button class="remover-produto" data-acao="remover">Remover</button>
            </div>
        `;
    });

    valorTotalElement.textContent = totalGeral.toFixed(2);
}

function adicionaEventosCarrinho() {
    carrinhoComProdutos.addEventListener('click', (e) => {
        if (!e.target.dataset.acao) return; 

        const produtoDiv = e.target.closest('.produtoCheckout');
        const id = parseInt(produtoDiv.dataset.id);
        const acao = e.target.dataset.acao;

        switch (acao) {
            case 'aumentar':
                alterarQuantidade(id, 1);
                break;
            case 'diminuir':
                alterarQuantidade(id, -1);
                break;
            case 'remover':
                removerItemCarrinho(id);
                break;
        }
    });
}

function alterarQuantidade(id, delta) {
    const itemIndex = carrinho.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    carrinho[itemIndex].quantidade += delta;

    if (carrinho[itemIndex].quantidade <= 0) {
        removerItemCarrinho(id); 
    } else {
        renderizarItensCarrinho(); 
        atualizarContadorCarrinho();
    }
}

function removerItemCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    
    const btnNaPagina = document.querySelector(`.btn-comprar[data-id="${id}"]`);
    if (btnNaPagina) {
        btnNaPagina.textContent = 'Adicionar ao carrinho';
        btnNaPagina.classList.remove('adicionado');
        btnNaPagina.disabled = false;
    }

    renderizarItensCarrinho();
    atualizarContadorCarrinho();
}


// --- LÓGICA DE PAGAMENTO (WHATSAPP) ---

function adicionaListenerPagamento() {
    btnPagamento.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let mensagem = `*Novo Pedido - ${NOME_LOJA}*\n\n`;
        mensagem += "*Resumo do Pedido:*\n";
        let total = 0;

        carrinho.forEach(item => {
            const subtotal = item.valor * item.quantidade;
            total += subtotal;
            mensagem += `------------------------------------\n`;
            mensagem += `*Produto:* ${item.nome}\n`;
            mensagem += `*Qtd:* ${item.quantidade}\n`;
            mensagem += `*Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
        });

        mensagem += `------------------------------------\n`;
        mensagem += `*Total do Pedido: R$ ${total.toFixed(2)}*\n\n`;
        mensagem += `Gostaria de finalizar este pedido.`;

        const urlWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
        
        window.open(urlWhatsApp, '_blank');
    });
}

// --- LÓGICA DE BUSCA E FILTRO ---

function adicionaListenersFiltro() {
    btnPesquisar.addEventListener('click', filtrarProdutos);
    inputPesquisa.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filtrarProdutos();
        }
    });
    selectCategoria.addEventListener('change', filtrarProdutos);
}

function filtrarProdutos() {
    const termoBusca = inputPesquisa.value.toLowerCase();
    const categoriaSelecionada = selectCategoria.value;

    const todosProdutosCards = document.querySelectorAll('.produto');

    todosProdutosCards.forEach(card => {
        const nomeProduto = card.dataset.nome;
        const categoriaProduto = card.dataset.categoriaRaw;

        const matchBusca = nomeProduto.includes(termoBusca);
        const matchCategoria = (categoriaSelecionada === "" || categoriaSelecionada === categoriaProduto);

        if (matchBusca && matchCategoria) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    document.querySelectorAll('.categoria-titulo').forEach(h2 => {
        const container = h2.nextElementSibling;
        const produtosVisiveis = container.querySelectorAll('.produto[style*="display: flex"]');
        h2.style.display = produtosVisiveis.length > 0 ? 'block' : 'none';
    });
}


// --- LÓGICA DO MODAL DE PRODUTO E OVERLAY (COM CORREÇÃO) ---

/**
 * **FUNÇÃO CORRIGIDA (abrirModalProduto)**
 * Removemos a lógica de 'cloneNode' e 'replaceChild'.
 * Agora, apenas atualizamos o estado do botão e guardamos o ID do produto no modal.
 */
function abrirModalProduto(id) {
    const produto = todosOsProdutos.find(p => p.id === id);
    if (!produto) return;

    // 1. Salva o ID no próprio modal
    produtoModal.dataset.currentProductId = id;

    // 2. Atualiza as informações do modal
    modalImg.style.background = `url('${produto.img}') center center no-repeat`;
    modalImg.style.backgroundSize = 'contain';
    modalNome.textContent = produto.nome;
    modalDescricao.textContent = produto.descricao;
    modalValor.textContent = `R$ ${produto.valor.toFixed(2)}`;

    // 3. Atualiza o estado do botão
    const itemNoCarrinho = carrinho.find(item => item.id === id);
    if (itemNoCarrinho) {
        modalAddCarrinho.textContent = 'Adicionado';
        modalAddCarrinho.classList.add('adicionado');
        modalAddCarrinho.disabled = true;
    } else {
        modalAddCarrinho.textContent = 'Adicionar ao carrinho';
        modalAddCarrinho.classList.remove('adicionado');
        modalAddCarrinho.disabled = false;
    }

    // 4. Mostra o modal
    produtoModal.style.display = 'block';
    overlay.classList.add('ativo');
    mainPrincipal.classList.add('blur');
}

/**
 * **NOVA FUNÇÃO (adicionaListenerModalCart)**
 * Esta função é chamada UMA VEZ quando a página carrega.
 * Ela adiciona um listener de clique ao botão do modal.
 * Esse listener vai LER qual produto está no modal (usando o dataset.currentProductId)
 * e o adicionará ao carrinho.
 */
function adicionaListenerModalCart() {
    modalAddCarrinho.addEventListener('click', () => {
        // Pega o ID que salvamos no modal
        const id = parseInt(produtoModal.dataset.currentProductId);
        if (!id) return; 

        const produto = todosOsProdutos.find(p => p.id === id);
        if (!produto) return;

        // Encontra o botão correspondente na lista principal
        const btnNaPagina = document.querySelector(`.btn-comprar[data-id="${produto.id}"]`);
        
        // Adiciona ao carrinho
        postCarrinho(produto, btnNaPagina); 
        
        // Atualiza o próprio botão do modal
        modalAddCarrinho.textContent = 'Adicionado';
        modalAddCarrinho.classList.add('adicionado');
        modalAddCarrinho.disabled = true;

        // Fecha o modal
        setTimeout(fecharModalProduto, 500); 
    });
}


function fecharModalProduto() {
    produtoModal.style.display = 'none';
    atualizarOverlayEBlur();
}

function atualizarOverlayEBlur() {
    const isCartOpen = (carrinhoCheckout.style.display === 'flex');
    const isModalOpen = (produtoModal.style.display === 'block');

    if (!isCartOpen && !isModalOpen) {
        overlay.classList.remove('ativo');
        mainPrincipal.classList.remove('blur');
    }
}

function adicionaListenerOverlay() {
    overlay.addEventListener('click', () => {
        if (produtoModal.style.display === 'block') {
            fecharModalProduto();
        }
        if (carrinhoCheckout.style.display === 'flex') {
            abreCarrinho('f');
        }
    });
}


// --- FUNÇÕES UTILITÁRIAS ---

function getCategoriaColor(categoria) {
    if (categoria === 'L') {
        return 'background-color: # #c2de0d; color: white;background: linear-gradient(302deg,rgba(194, 222, 13, 0.99) 22%, rgba(247, 223, 223, 1) 100%);';
    } else if (categoria === '+18') {
        return 'background-color: black; color: white;';
    } else {
        return 'background-color: gray; color: white;';
    }
}

function getCategoriaTitle(title) {
    if (title === 'L') {
        return 'Livre para todos os públicos';
    } else if (title === '+18') {
        return 'Proibido para menores de 18 anos';
    } else {
        return 'Classificação não especificada';
    }
}

function notificacao() {
    const pedidoAdicionado = document.querySelector('.pedidoAdicionado');
    pedidoAdicionado.style.display = 'flex';
    setTimeout(() => {
        pedidoAdicionado.style.display = 'none';
    }, 2000);
}