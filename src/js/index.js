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
      criaCard(whiskys, produtoFinal['whisky']);
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


const carrinho = []
let idProduto = 0
function postCarrinho(valor, nome, imagem , id) {
  idProduto + id
  const carrinhoCount = document.querySelector(".quantidade")
  carrinhoCount.classList.remove("off")
  
  carrinho.push({ nome, valor, imagem , idProduto})

  console.log(carrinho)
  carrinhoCount.innerHTML = carrinho.length
}

function abreCarrinho(response) {
  const carrinhoCheckout = document.querySelector(".carrinhoCheckout");
  const mainPrincipal = document.querySelector("main");
  const carrinhoComProdutos = document.querySelector(".produtos");

  if (response === 'a') {
   
    carrinhoCheckout.style.display = 'flex';
    mainPrincipal.style.display = 'none';
    carrinhoComProdutos.innerHTML = '';

    carrinho.forEach((item, index) => {
      carrinhoComProdutos.innerHTML += `
        <div class="produtoCheckout" data-index="${index}">
          <div class="imgProduto" style="background: url('${item.imagem}') center center no-repeat; background-size: contain;"></div>
          <h2>${item.nome}</h2>
          <h3 class="preco-item">R$ ${item.valor.toFixed(2)}</h3>

          <div class="detalhes-produto">
            <button class="qdButton aumentar">+</button>
            <div class="quantidadeProduto">1</div>
            <button class="qdButton diminuir">-</button>
          </div>

          <button class="remover-produto">Remover</button>
        </div>
      `;
    });

   
    adicionaEventosCarrinho();
  } 
  else if (response === 'f') {
    
    carrinhoCheckout.style.display = 'none';
    mainPrincipal.style.display = 'block';
    carrinhoComProdutos.innerHTML = '';
  }
}


function qdProduto(response , id){
 if(response === '+'){
     
 }else if(response === '-'){

 }
}