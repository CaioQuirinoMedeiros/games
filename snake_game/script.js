/********** DOM **********/
const board = document.querySelector('.board');
const stage = document.getElementById('stage');
const timerBox = document.querySelector('.timer');
const timerSec = document.getElementById('timer-sec');
const comida = document.getElementById('comida');
const highScore = document.getElementById('high-score');
const pontos = document.getElementById('pontos');
const newGame = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const list = document.querySelector('.list');
const dificuldadeWrapper = document.querySelector('.dificuldade-wrapper');
const dificuldadeArrow = document.getElementById('dificuldade-arrow');
const dificuldade = document.getElementById('dificuldade');
const wallEl = document.getElementById('wall');
const settingsBtn = document.getElementById('settings');
const settings = document.querySelector('.settings-wrapper');
const startIcon = document.getElementById('start-icon');
const startName = document.getElementById('start-name');
const resumeWrapper = document.querySelector('.resume-wrapper');
const resumeCount = document.getElementById('resume-timer');
const summaryWrapper = document.querySelector('.summary-wrapper');
const summaryDifficulty = document.getElementById('summary-difficulty');
const summaryWall = document.getElementById('summary-wall');
const summaryElapTime = document.getElementById('summary-elap-time');
const summaryLength = document.getElementById('summary-length');
const summaryAcc = document.getElementById('summary-acc');
const summaryScore = document.getElementById('summary-score');


let game = {}
let food = {};
let snake = {};
let vel = {};

/***** Toggle blur *****/
toggleBlur = () => {
    board.classList.toggle('blur');
    console.log('blur!')
}

/***** Show *****/
show = el => {
    el.classList.remove('scale-0');
    el.classList.add('scale-1');
}
/***** hide *****/
hide = el => {
    el.classList.remove('scale-1');
    el.classList.add('scale-0');
}
/***** Show by opacity*****/
showOp = el => {
    el.classList.remove('opacity-0');
    el.classList.add('opacity-1');
}
/***** hide by opacity *****/
hideOp = el => {
    el.classList.remove('opacity-1');
    el.classList.add('opacity-0');
}
/***** Show by display *****/
showDisp = el => {
    el.style.display = 'block';
    dificuldadeArrow.classList.remove('ion-md-arrow-dropdown');
    dificuldadeArrow.classList.add('ion-md-arrow-dropup');
}
/***** hide by display *****/
hideDisp = el => {
    el.style.display = 'none';
    dificuldadeArrow.classList.remove('ion-md-arrow-dropup');
    dificuldadeArrow.classList.add('ion-md-arrow-dropdown');
}

/********** EVENTO PARA FECHAR AS CONFIGURAÇÕES *********/
settings.addEventListener('click', e => {
    // Se clicar fora ou no X, fechar as configurações
    if (e.target.matches('.settings-wrapper, .close-wrapper, .btn-ok')) {
        hide(settings);
        toggleBlur();
    };
    // Atualizar o setup a cada clique
    setup();
    // Salvar as configurações no storage
    saveStorage();
});

/********** EVENTO PARA ABRIR AS CONFIGURAÇÕES **********/
settingsBtn.addEventListener('click', () => {
    // Se estiver jogando, retornar
    if (snake.playing) return;
    // Abrir ou fechar as configurações
    if (!settings.classList.contains('scale-1')) {
        show(settings);
        toggleBlur();
    };
});

/********** EVENTO PARA ABRIR AS OPÇÕES DE DIFICULDADE **********/
dificuldadeWrapper.addEventListener('click', () => {
    if (list.style.display === 'block') {
        hideDisp(list);
    } else {
        showDisp(list);
    }
});

/********** EVENTO PARA SELECIONAR A DIFICULDADE **********/
list.addEventListener('click', e => {
    // Se clicar na margem de um item, retornar
    if (!e.target.matches('li')) return
    // Renderizar o texto da dificuldade
    dificuldade.textContent = e.target.textContent;
    // Atribuir a dificuldade no jogo
    game.dificuldade = e.target.id;
    // Fechar a lista de opções
    hideDisp(list);
});

/********** EVENTO PARA FECHAR AS OPÇÕES DE DIFICULDADE **********/
settings.addEventListener('click', e => {
    // Se o clique não chegar na div dificuldade, fechar as opções
    if (!e.target.closest('.dificuldade')) hideDisp(list);
});

/******************** SETUP ********************/
const setup = () => {
    // Definir o contexto do jogo
    game.context = stage.getContext('2d');
    
    // Definir a grade do jogo
    game.pixel = 20;
    game.pixels = stage.width/game.pixel;

    // Limpar o stage
    game.context.clearRect(0, 0, game.pixel*game.pixels, game.pixel*game.pixels);
    
    // Escolher dificuldade
    if (!game.dificuldade) game.dificuldade = 'medium';
    switch(game.dificuldade) {
        case 'easy':
            game.step = 250;
            multiplicador = 0.8;
            break;
        case 'medium':
            game.step = 150;
            multiplicador = 1;
            break;
        case 'hard':
            game.step = 70;
            multiplicador = 1.5;
            break;
        case 'impossible':
            game.step = 45;
            multiplicador = 2;
            break;
    }

    // Definir o tamanho inicial da cobra
    snake.startLength = 5;
    snake.length = snake.startLength;

    // Definir o muro e ajustar multiplicador
    game.wall = wallEl.checked;
    if (game.wall) multiplicador *= 2;
    console.log(`Multiplicador ajustado para ${multiplicador}!`)
    renderWall();

    // Definir a velocidade
    vel.value = 1;

    // Definir contador e tempo
    snake.tempo = snake.contador = game.elapsedTime = 0;

    // Declarar highScore
    if (!game.highScore) game.highScore = 0;

    // Zerar a quantidade de comidas do game
    game.comidas = 0;

    // Zerar a quantidade de comidas da cobra
    snake.comidas = 0;
    renderComida();

    snake.efficiency = 0;

    // Zerar os pontos da cobra
    snake.points = 0;
    renderPoints();

    // Esconder cronometro
    hideOp(timerBox);

    // Esconder botão de stop
    hideOp(stopBtn);

    // Mostrar botão config
    showOp(settingsBtn);

    // Iniciar evento de start
    newGame.addEventListener('click', start);

    // Mostrar botão de start
    showOp(newGame);

    // Posicionar a cobra no meio
    snake.x = snake.y = parseInt(game.pixels/2);

    // Zerar o rabo
    snake.tail = [];
}

/******************** NEW GAME ********************/
const start = () => {
    // Setup do jogo
    setup();

    // Adicionar comida
    getFood();

    // Definir a velocidadeda cobra
    vel.x = vel.value;
    vel.y = 0;

    // Iniciar o jogo
    snake.playing = true;

    // Remover o evento de start e de stop
    newGame.removeEventListener('click', start);

    // Iniciar o evento de pause
    newGame.addEventListener('click', pause);

    // Iniciar o evento de stop
    stopBtn.addEventListener('click', stopPlaying);

    // Mostrar botão de stop
    showOp(stopBtn);

    // Esconder o botão de configurações
    hideOp(settingsBtn);

    // Resumir o jogo (que na verdade está começando);
    gameOn = false;
    pause();
    
    // Mostrar cronometro
    showOp(timerBox);
};

/******************** Adicionar comida ********************/
getFood = () => {
    // Definir nova posição da comida
    food.x = Math.floor(Math.random()*game.pixels);
    food.y = Math.floor(Math.random()*game.pixels);

    // Conferir se nova posição não colide com a cobra;
    while (tailColision(food.x, food.y)) {
        food.x = Math.floor(Math.random()*game.pixels);
        food.y = Math.floor(Math.random()*game.pixels);
    };

    // Pintar a comida
    fillRect(food.x, food.y, 'rgb(69, 123, 157)');

    // Calcular o aproveitamento da snake
    snake.efficiency = snake.comidas / game.comidas;
    
    // Adicionar ao total de comidas no game
    game.comidas += 1;

    // Calcular a distancia da comida
    food.dist = calcDist();
    console.log(`Distancia: ${food.dist}`);
    
    // Atribuir o valor do tempo
    snake.tempo = snake.contador = food.dist*1000 + (snake.length / 5);
};

/***** Render wall *****/
renderWall = () => game.wall ? stage.classList.add('stage-wall') : stage.classList.remove('stage-wall');

/***** Limpar um retangulo *****/
clearRect = (x, y) => {
    game.context.clearRect(x*game.pixel, y*game.pixel, game.pixel, game.pixel);
};

/***** Pintar um retangulo *****/
fillRect = (x, y, color) => {
    game.context.fillStyle = color;
    game.context.fillRect(x*game.pixel, y*game.pixel, game.pixel, game.pixel);
};

/***** Detectar colisão com a cabeça *****/
headColision = (x, y) => (snake.x === x && snake.y === y);

/***** Detectar colisão com o rabo *****/
tailColision = (x, y) => {
    let colision = false;
    let inc = 28 / (snake.tail.length - 1);
    snake.tail.forEach((el, ind) => {
        fillRect(el.x, el.y, `hsl(355, 100%, ${65-ind*inc}%)`);
        /* fillRect(el.x, el.y, `hsl(${ind*inc}, 100%, 50%)`); */
        if (el.x === x && el.y === y) {
            colision = true;
            fillRect(el.x, el.y, 'hsl(50, 100%, 50%)');
        }
    });
    return colision;
};

/***** Lidar com colisão com a parede *****/
wallColision = () => {
    let colision = true;
    if (snake.x < 0) snake.x = game.pixels - 1 
    else if (snake.x > game.pixels - 1) snake.x = 0
    else if (snake.y < 0 ) snake.y = game.pixels - 1
    else if (snake.y > game.pixels - 1) snake.y = 0;
    else colision = false;
    if (colision) console.log('Parede!');
    return colision
};

/***** Calcular a distância *****/
calcDist = () => {
    food.distX= snake.x - food.x;
    food.distY = snake.y - food.y;
    return Math.round(Math.sqrt(Math.pow(food.distX, 2) + Math.pow(food.distY, 2)));
};

/***** Timer *****/
timer = () => {
    // Diminuir 5 milisegundos (igual ao tempo do setInterval game.startTimer)
    snake.contador -= 5;
    // Se passar de 0, limpa a comida e define outra
    if (snake.contador <= 0) {
        clearRect(food.x, food.y);
        getFood();
    }
    // Renderizar os segundos e milisegundos na tela;
    timerSec.textContent = Math.round(snake.contador/1000);
    timerBox.style.color = `hsl(${100*snake.contador/snake.tempo}, 100%, 70%)`;
};

/***** Get points *****/
getPoints = () => {
    snake.points += Math.ceil((snake.contador / snake.tempo) * 10 * multiplicador);
    renderPoints();
};
/***** Render points *****/
renderPoints = () => pontos.textContent = snake.points;

/***** Get comida *****/
getComida = () => {
    snake.comidas++;
    renderComida();
}
/***** Render comidas *****/
renderComida = () => comida.textContent = snake.comidas + snake.startLength;

/***** Set high score *****/
getHighScore = () => {
    // Atualizar o game.highScore se a pontuação for maior
    if (snake.points > game.highScore) game.highScore = snake.points;
    // Renderizar o high score
    highScore.textContent = game.highScore;
};

/***** Pintar os olhos da cobra *****/
makeEyes = () => {
    game.context.fillStyle = 'rgb(241, 250, 238)';
    if (vel.y) {
        game.context.fillRect(snake.x*game.pixel+3, snake.y*game.pixel+9, 3, 3);
        game.context.fillRect(snake.x*game.pixel+13, snake.y*game.pixel+9, 3, 3);
    } else {
        game.context.fillRect(snake.x*game.pixel+9, snake.y*game.pixel+3, 3, 3);
        game.context.fillRect(snake.x*game.pixel+9, snake.y*game.pixel+13, 3, 3);
    }
}
/******************** STOP ********************/
const stopPlaying = () => {
    console.log('Jogo Acabou!');
    // Pegar o high score (já renderiza se for maior);
    getHighScore();

    // Salvar o game no storage
    saveStorage();

    // Definir o playing igual a false
    snake.playing = false;

    // Paralizar o jogo se ainda não estiver paralizado (caso de stop após pausar!)
    gameOn ? pause() : changeBtnStart();
    
    // Remover evento de pausa
    newGame.removeEventListener('click', pause);

    // Esconder botão de pause
    hideOp(newGame);

    // Remover evento de stop
    stopBtn.removeEventListener('click', stopPlaying);

    // Esconer botão de stop
    hideOp(stopBtn);

    // Setup!
    setTimeout(summaryRender, 1500);
};

/***** Add zero *****/
addZero = num => {
    if (num.toString().length === 1) return `0${num}`;
    else return num.toString();
}

/******************** EVENTO PARA FECHAR O SUMMARY ********************/
summaryWrapper.addEventListener('click', e => {
    // Se clicar fora ou no X, fechar o sumário
    if (e.target.matches('.summary-wrapper, .close-wrapper, .btn-ok')) {
        hide(summaryWrapper);
        toggleBlur();
        setup();
    };
});

/******************** SUMMARY ********************/
const summaryRender = () => {
    summaryDifficulty.textContent = game.dificuldade.charAt(0).toUpperCase()+game.dificuldade.slice(1);
    summaryWall.textContent = game.wall ? 'Yes' : 'No';

    const elap = Math.round(game.elapsedTime / 1000);
    const mins = addZero(Math.floor(elap / 60));
    const secs = addZero(elap - 60 * Math.floor(elap / 60));
    summaryElapTime.textContent = `${mins}:${secs}`;

    summaryLength.textContent = snake.length;
    summaryAcc.textContent = `${Math.round(10000 * snake.efficiency) / 100} %`;
    summaryScore.textContent = snake.points;

    show(summaryWrapper);
    toggleBlur();
}

/******************** ROLLING ********************/
const rolling = () => {
    // Somar ao tempo total
    game.elapsedTime += game.step;
    console.log(`Tempo decorrido: ${game.elapsedTime/1000}`);

    // Adicionar antiga posição na tail
    snake.tail.push({x:snake.x, y:snake.y});

    // Mover cobra para nova posição
    snake.x += vel.x
    snake.y += vel.y

    // Detectar colisão com a parede
    wall = wallColision();
    if (wall && game.wall) {
        console.log("Bateu na parede!")
        stopPlaying();
        return
    }
    
    // Detectar colisão com o rabo
    if (tailColision(snake.x, snake.y)) {
        console.log("Bateu no rabo!");
        stopPlaying();
        return;
    }

    // Pintar a nova posição da cobra
    fillRect(snake.x, snake.y, 'hsl(355, 100%, 30%)');

    // Pintar os olhos da cobra
    makeEyes();
    
    // Permitir a troca de velocidade com evento das setas
    vel.change = true;

    // Detectar se pegou comida
    if (headColision(food.x, food.y)) {
        // Atualizar contagem de comidas
        getComida();
        // Atualizar contagem de pontos
        getPoints();
        // Gerar uma nova comida
        getFood();
        // Aumentar o tamanho da cobra
        snake.length++;
    };

    // Limpar o último rastro
    if (snake.tail.length > snake.length) {
        clearRect(snake.tail[0].x, snake.tail[0].y);
        snake.tail.shift();
    };
};

let gameOn = false;
let playing;

/***** Change button start *****/
changeBtnStart = () => {
    if(!snake.playing) {
        startIcon.style.display = 'none';
        startName.textContent = 'START!';
        return
    }
    startIcon.style.display = 'block';
    if (gameOn) {
        startIcon.classList.remove('ion-md-pause');
        startIcon.classList.add('ion-md-play');
        startName.textContent = 'Resume';
    } else {
        startIcon.classList.remove('ion-md-play');
        startIcon.classList.add('ion-md-pause');
        startName.textContent = 'Pause';
    }
};

/******************** PAUSE ********************/
const pause = () => {
    // Parar a engrenagem do jogo (evento rolling)
    clearInterval(playing);

    // Mudar o estilo do botão
    changeBtnStart();

    // Pausar demais eventos
    if (gameOn) {
        // Desativar o evento das setas
        window.removeEventListener('keydown', changeDirection);
        // Pausar o timer
        clearInterval(game.startTimer);
        // Definir jogo pausado
        gameOn = false;
    }
    else {
        resumeTimer();
    };
};

resumeTimer = () => {
    show(resumeWrapper);
    toggleBlur();
    resumeCount.textContent = 3;
    console.log('3');
    setTimeout(() => {
        resumeCount.textContent = 2;
        console.log('2');
        setTimeout(() => {
            resumeCount.textContent = 1;
            console.log('1');
            setTimeout(resumeGame, 1000);
        }, 1000)
    }, 1000)
};

resumeGame = () => {
    toggleBlur();
    hide(resumeWrapper);
    console.log('resumido!')
    // Rodar a engrengem do jogo
    playing = setInterval(rolling, game.step);
    // Ativar o evento das setas
    window.addEventListener('keydown', changeDirection);
    // Iniciar o timer
    game.startTimer = setInterval(timer, 5);
    // Definir como jogo rodando
    gameOn = true;
}

/********** SALVAR NO STORAGE **********/
saveStorage = () => {
    localStorage.setItem('game', JSON.stringify(game));
};

/********** CARREGAR O STORAGE **********/
readStorage = () => {
    const storage = JSON.parse(localStorage.getItem('game'));
    if (storage) game = storage;
}

/******************** CARREGAR A PÁGINA ********************/
window.addEventListener('load', () => {
    // Carregar o storage
    readStorage();

    // Renderizar o checkmark caso game.wall seja true
    if (game.wall) wallEl.checked = game.wall;

    // Renderizar a dificuldade
    dificuldade.textContent = document.getElementById(game.dificuldade).textContent;

    // Renderizar o high score
    getHighScore();

    // Rodar o setup
    setup();

    // Adicionar evento para dar start no jogo
    newGame.addEventListener('click', start);
});

/********** EVENTO DAS SETAS PARA DIRECIONAR **********/
const changeDirection = (e) => {
    switch(e.keyCode) {
        case 37:
            vel.xAdd = -1*vel.value;
            vel.yAdd = 0;
            break;
        case 38:
            vel.xAdd = 0;
            vel.yAdd = -1*vel.value;
            break;
        case 39:
            vel.xAdd = 1*vel.value;
            vel.yAdd = 0;
            break;
        case 40:
            vel.xAdd = 0;
            vel.yAdd = 1*vel.value;
            break;
    }
    if (!(vel.x + vel.xAdd === 0 && vel.y + vel.yAdd === 0) && vel.change){
        vel.x = vel.xAdd;
        vel.y = vel.yAdd;
        vel.change = false;
    } else if (!vel.change) {console.log('Muito rápido')}
}