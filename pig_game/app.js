let scores,
  roundScore,
  activePlayer,
  dice1,
  dice2,
  gamePlaying,
  winPoints,
  dice1DOM,
  dice2DOM;
config();

dice1DOM = document.querySelector("#dice-1");
dice2DOM = document.querySelector("#dice-2");

//Botão Roll
document.querySelector(".btn-roll").addEventListener("click", function() {
  if (gamePlaying) {
    // Random number
    dice1 = Math.floor(Math.random() * 6) + 1;
    dice2 = Math.floor(Math.random() * 6) + 1;

    // Display the result
    dice1DOM.style.display = "block";
    dice1DOM.src = "images/dice-" + dice1 + ".png";
    dice2DOM.style.display = "block";
    dice2DOM.src = "images/dice-" + dice2 + ".png";

    // Update de current score
    if (dice1 !== 1 && dice2 !== 1 && dice1 + dice2 !== 12) {
      roundScore += dice1 + dice2;
      document.querySelector(
        "#current-" + activePlayer
      ).textContent = roundScore;
    } else {
      // Next player
      nextPlayer();
    }
  }
});

// Botão Hold
document.querySelector(".btn-hold").addEventListener("click", function() {
  if (gamePlaying) {
    // Add current score to global score
    scores[activePlayer] += roundScore;

    // Update the UI
    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];

    // Check if player won the game
    if (scores[activePlayer] >= winPoints) {
      document.querySelector("#name-" + activePlayer).textContent = "Winner!";
      dice1DOM.style.display = "none";
      dice2DOM.style.display = "none";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      gamePlaying = false;
    } else {
      // Next player
      nextPlayer();
    }
  }
});

// Next player
function nextPlayer() {
  activePlayer === 1 ? (activePlayer = 0) : (activePlayer = 1);

  roundScore = 0;

  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");

  dice1DOM.style.display = "none";
  dice2DOM.style.display = "none";
}

// Botão de New Game
document.querySelector(".btn-new").addEventListener("click", config);

// Abrir janela de opções
function config() {
  document.querySelector(".config-panel").style.display = "block";
  document.getElementById("win-points-slider").value = 100;
  document.getElementById("win-points").value = 100;
  document.getElementById("player-0-name").value = "Player 1";
  document.getElementById("player-1-name").value = "Player 2";
}

// Slider do Win Points
document
  .querySelector("#win-points-slider")
  .addEventListener("mousemove", function() {
    document.querySelector("#win-points").value = document.querySelector(
      "#win-points-slider"
    ).value;
  });

// Botão de Start game
document.querySelector(".btn-start").addEventListener("click", init);

// Start Game
function init() {
  if (
    document.getElementById("player-0-name").value === "" ||
    document.getElementById("player-1-name") === ""
  ) {
    alert("Preencha os nomes");
    return;
  }
  gamePlaying = true;

  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;

  document.querySelector("#dice-1").style.display = "none";
  document.querySelector("#dice-2").style.display = "none";

  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  winPoints = parseInt(document.getElementById("win-points").value);

  document.querySelector("#name-0").textContent = document.getElementById(
    "player-0-name"
  ).value;
  document.querySelector("#name-1").textContent = document.getElementById(
    "player-1-name"
  ).value;
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");

  document.querySelector(".config-panel").style.display = "none";
}
