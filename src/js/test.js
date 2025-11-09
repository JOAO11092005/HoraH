

const produtoCerveja = `
    
            <div class="produto">
                    <img src="${produto['cervejas'][0]['img']}"
                        alt="Heinekken">
                    <div class="info-produto">
                        <h3 class="nome-produto">${produto['cervejas'][0]['nome']}</h3>
                        <p class="categoria">${produto['cervejas'][0]['categoria']}</p>
                        <h4 class="preco">valor R$ ${produto['cervejas'][0]['valor']}</h4>

                    </div> 
                    <button class="btn-comprar">Adicionar ao carrinho</button>

            </div>
    `