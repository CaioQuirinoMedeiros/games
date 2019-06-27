let vocêPontos = 0;
let compPontos = 0;

let DOMstrings = {
    imgVocê: document.querySelector('#resultado__display--você'),
    imgComp: document.querySelector('#resultado__display--comp'),
    botões: document.querySelector('.opções'),
    textoResultado: document.getElementById('resultado__texto'),
    pontuaçãoVocê: document.querySelector('#pontuação__você'),
    pontuaçãoComp: document.querySelector('#pontuação__comp'),
    mensagem: document.getElementById('mensagem')
}

let minhaEscolha = function(id) {
    return id
}

let compEscolha = function() {
    let aleatório, comp;

    aleatório = Math.floor(Math.random()*3);

    switch (aleatório) {
        case 0: comp = 'pedra'; break;
        case 1: comp = 'papel'; break;
        case 2: comp = 'tesoura';
    }

    return comp
}

function pedra(versus) {
    return versus === 'tesoura' ? 'ganhou' : 'perdeu'
}
function papel(versus) {
    return versus === 'pedra' ? 'ganhou' : 'perdeu'
}
function tesoura(versus) {
    return versus === 'papel' ? 'ganhou' : 'perdeu'
}

let decidirResultado = function(você, comp) {
    let resultado, função;

    if (você === comp) {
        resultado = 'empate'
    } else {
        resultado = window[você](comp);
    }

    return resultado
}

let attImagens = function(você, comp) {
    DOMstrings.imgVocê.src = `imagens/${você}.png`
    DOMstrings.imgComp.src = `imagens/${comp}.png`
}

let convertToNumber = function(jogada){
    let número;

    if (jogada === 'pedra') {
        número = 0;
    } else if (jogada === 'papel') {
        número = 1;
    } else {
        número = 2;
    }

    return número
}

let attTexto = function(você, comp, result) {
    let texto;

    vocêNum = convertToNumber(você);
    compNum = convertToNumber(comp);
    soma = vocêNum + compNum;

    if (result === 'empate') {
        texto = 'Empate'
    } else if (soma === 1) {
        texto = `Papel enrola a pedra. Você ${result}!`
    } else if (soma === 2) {
        texto = `Pedra esmaga a tesoura. Você ${result}!`
    } else {
        texto = `Tesoura corta o papel. Você ${result}!`
    }

    DOMstrings.textoResultado.textContent = texto;
    DOMstrings.mensagem.textContent = '';
}

let somarPlacar = function(result) {
    if (result === 'ganhou') {
        vocêPontos += 1;
    } else if (result === 'perdeu') {
        compPontos += 1;
    }
}

let attPlacar = function(vocêP, compP) {
    DOMstrings.pontuaçãoVocê.textContent = vocêP;
    DOMstrings.pontuaçãoComp.textContent = compP;
}

let limpar = function () {
    DOMstrings.imgVocê.src = '';
    DOMstrings.imgComp.src = '';
    DOMstrings.textoResultado.textContent = String.fromCharCode(160);
    DOMstrings.mensagem.textContent = 'Faça sua jogada';
    DOMstrings.botões.addEventListener('click', escolha);
}

let escolha = function(event) {
    let escolhaID = event.target.parentNode.id;
    if (escolhaID === '') {return}

    DOMstrings.botões.removeEventListener('click', escolha)

    // atribuir a minha escolha
    let você = minhaEscolha(escolhaID);

    // atribuir a escolha do computador
    let comp = compEscolha();

    // mostrar as imagens correspondentes
    attImagens(você, comp);

    // verificar quem ganhou
    let resultado = decidirResultado(você, comp);

    // mostrar o texto correspondente
    attTexto(você, comp, resultado);

    // contar o placar
    somarPlacar(resultado);

    // atualizar a visão do placar
    attPlacar(vocêPontos, compPontos);

    // limpar
    setTimeout(limpar, 2000);

}

limpar();





