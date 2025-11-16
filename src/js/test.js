const cervejas = document.getElementById("cerveja-cards");
const refrigerantes = document.getElementById("refrigerante-cards");
const whiskys = document.getElementById("whisky-cards");
const energeticos = document.getElementById("energetico-cards");
const cachacas = document.getElementById("cachaca-cards");

async function apiProdutos() {
  const url = await fetch('./src/json/produtos.json');
  const response = await url.json();
  return response;
}

const produto = apiProdutos().then(response => {
  produtos('cervejas', response);
  produtos('refrigerantes', response);
  produtos('whisky', response);
  produtos('energeticos', response);
  produtos('cachacas', response);
});

function produtos(tipo, produtoFinal) {
  switch (tipo) {
    case 'cervejas':
      criaCard(cervejas, produtoFinal['cervejas']);
      break;
    case 'refrigerantes':
      criaCard(refrigerantes, produtoFinal['refrigerantes']);
      break;
    case 'whisky':
      criaCard(whiskeys, produtoFinal['whisky']);
      break;
    case 'energeticos':
      criaCard(energeticos, produtoFinal['energeticos']);
      break;
    case 'cachacas':
      criaCard(cachacas, produtoFinal['cachacas']);
      break;
    default:
      console.warn(`Categoria não reconhecida: ${tipo}`);
  }
}

window.addEventListener('scroll', () => {
  const filtro = document.querySelector('.filtro');
  const carrinho = document.querySelector(".carrinho");
  const logoEmpresa = document.querySelector(".logo-empresa");
  if (window.scrollY > 50) {
    filtro.classList.add('fixo');
    carrinho.classList.add('ativo');
    logoEmpresa.classList.add("ativo");
  } else {
    filtro.classList.remove('fixo');
    carrinho.classList.remove('ativo');
    logoEmpresa.classList.remove("ativo");
  }
});

function criaCard(response, produtoFinal) {
  produtoFinal.map(resposta => {
    const categoria = resposta['categoria'];
    const produtoResponse = `
      <div class="produto">
        <div class="img" title="${resposta['nome']}"
          style="background: url('${resposta['img']}') center center no-repeat; background-size: contain;"></div>
        <div class="info-produto">
          <h3 class="nome-produto">${resposta['nome']}</h3>
          <p class="categoria" style="${getCategoriaColor(categoria)}" title="${getCategoriaTitle(categoria)}">${categoria}</p>
          <h4 class="preco">Valor R$${resposta['valor']}</h4>
        </div>
        <button class="btn-comprar" onclick="postCarrinho(${resposta['valor']},'${resposta['nome']}', '${resposta['img']}')">Adicionar ao carrinho</button>
      </div>
    `;
    response.innerHTML += produtoResponse;
  });
}

function getCategoriaColor(categoria) {
  if (categoria === 'L') {
    return 'background: linear-gradient(302deg,rgba(194, 222, 13, 0.99) 22%, rgba(247, 223, 223, 1) 100%); color: black;';
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

// ==========================
// CARRINHO DE COMPRAS
// ==========================
const carrinho = [];
let idProduto = 0;

function postCarrinho(valor, nome, imagem) {
  idProduto++;
  const carrinhoCount = document.querySelector(".quantidade");
  carrinhoCount.classList.remove("off");

  carrinho.push({ nome, valor, imagem, quantidade: 1, id: idProduto });
  carrinhoCount.innerHTML = carrinho.length;

  const aviso = document.querySelector(".pedidoAdicionado");
  aviso.style.display = "block";
  setTimeout(() => aviso.style.display = "none", 1500);
}

function abreCarrinho(response) {
  const carrinhoCheckout = document.querySelector(".carrinhoCheckout");
  const mainPrincipal = document.querySelector("main");
  const carrinhoComProdutos = document.querySelector(".produtos");

  if (response === 'a') {
    carrinhoCheckout.style.display = 'flex';
    mainPrincipal.style.display = 'none';
    renderCarrinho(carrinhoComProdutos);
  } else if (response === 'f') {
    carrinhoCheckout.style.display = 'none';
    mainPrincipal.style.display = 'block';
  }
}

function renderCarrinho(carrinhoComProdutos) {
  carrinhoComProdutos.innerHTML = '';
  carrinho.forEach((item, index) => {
    carrinhoComProdutos.innerHTML += `
      <div class="produtoCheckout" data-index="${index}">
        <div class="imgProduto" style="background: url('${item.imagem}') center center no-repeat; background-size: contain;"></div>
        <h2>${item.nome}</h2>
        <h3 class="preco-item">R$ ${item.valor.toFixed(2)}</h3>
        <div class="detalhes-produto">
          <button class="qdButton aumentar">+</button>
          <div class="quantidadeProduto">${item.quantidade}</div>
          <button class="qdButton diminuir">-</button>
        </div>
        <button class="remover-produto">Remover</button>
      </div>
    `;
  });
  adicionaEventosCarrinho();
  atualizaTotal();
}

function adicionaEventosCarrinho() {
  document.querySelectorAll('.aumentar').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.closest('.produtoCheckout').dataset.index;
      carrinho[index].quantidade++;
      renderCarrinho(document.querySelector('.produtos'));
    });
  });

  document.querySelectorAll('.diminuir').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.closest('.produtoCheckout').dataset.index;
      if (carrinho[index].quantidade > 1) carrinho[index].quantidade--;
      renderCarrinho(document.querySelector('.produtos'));
    });
  });

  document.querySelectorAll('.remover-produto').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.closest('.produtoCheckout').dataset.index;
      carrinho.splice(index, 1);
      renderCarrinho(document.querySelector('.produtos'));
      document.querySelector(".quantidade").innerText = carrinho.length || '';
      if (carrinho.length === 0) document.querySelector(".quantidade").classList.add("off");
    });
  });

  document.querySelector('.pagamento').addEventListener('click', finalizarCompra);
}

function atualizaTotal() {
  const total = carrinho.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
  const totalSpan = document.getElementById("valorTotal");
  totalSpan.innerText = total.toFixed(2);
  totalSpan.style.textShadow = "0 0 10px gold, 0 0 20px yellow";
  setTimeout(() => totalSpan.style.textShadow = "", 800);
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "🛒 *Pedido Conveniência Hora H* %0A%0A";
  carrinho.forEach(item => {
    mensagem += `🍾 ${item.nome} x${item.quantidade} - R$ ${(item.valor * item.quantidade).toFixed(2)}%0A`;
  });
  const total = carrinho.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
  mensagem += `%0A💰 *Total:* R$ ${total.toFixed(2)}%0A%0A📍 Envie seu endereço e forma de pagamento.`;

  const numeroWhats = "5583999999999"; // Coloque aqui o número da loja (com DDI 55)
  const url = `https://wa.me/${numeroWhats}?text=${mensagem}`;
  window.open(url, "_blank");
}
