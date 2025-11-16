// responsive.js
// Detecta se a tela é mobile e ativa o layout mobile automaticamente

function ativarMobile() {
    // Quando for celular
    if (window.innerWidth <= 480) {
        
        // --- SE VOCÊ TIVER UM ARQUIVO mobile.html ---
        // redireciona para a versão mobile
        if (!window.location.href.includes("mobile.html")) {
            window.location.href = "./mobile.html";
        }

    } else {

        // --- Se estiver no desktop e estiver na página mobile, volta para index.html ---
        if (window.location.href.includes("mobile.html")) {
            window.location.href = "./index.html";
        }
    }
}

// roda ao carregar a página
window.onload = ativarMobile;

// roda quando redimensiona
window.onresize = ativarMobile;
