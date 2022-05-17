// ---VARIABLES DE ENTORNO---
const STAGETOTALSECONDS = 15; //Tiempo de duración de partida en segundos
const MOLESAPPEARMILISECONDS = 1400; //Tiempo de aparición estándar de topos
const MOLESAPPEARMAXVARIATIONMILISECONDS = 1000; //Tiempo de aparición estándar de topos
const MOLEDISAPPEARMILISECONDS = 700; //Tiempo de aparición estándar de topos
const MOLEATTEMPTDISAPPEARMILISECONDS = 500; //Tiempo de aparición estándar de topos

// ---VARIABLES DE ESTILO---
const MSJMESSAGECOLOR = "#90e0ef"; //Colores del Tostify, Mensaje
const MSJERRORCOLOR = "#f28482"; //Colores del Tostify, Error
const MSJCONFIRMCOLOR = "#81b29a"; //Colores del Tostify, Confirmación

const IMGMOLE = "./img/mole.jpg"; //Colores del Tostify, Mensaje
const IMGCLEAR = "./img/clear.jpg"; //Colores del Tostify, Error
const IMGSMASHED = "./img/smashed.jpg"; //Colores del Tostify, Confirmación
const IMGMISS = "./img/miss.jpg"; //Colores del Tostify, Confirmación

// ---VARIABLES GLOBALES---
let intervalTimer; //Intervalo de segundos del juego
let timeoutMole; //Timeout de aparición de topos
let stage = new Stage(0, ""); //Manejador de partida
//----------------------

init();

function init() {
  //Carga datos y funcionalidad de APP
  loadSave();
  addEventNewPlayer();
  showRankingDOM();
}

function loadSave() {
  //Carga de LocalStorage si ya existen datos previos
  let localPlayers = localStorage.getItem("ranking")
    ? JSON.parse(localStorage.getItem("ranking"))
    : [];
  players = localPlayers;
}

function addEventNewPlayer() {
  //Agrega eventos a los elementos que lo requieran
  //Evento agregar jugador
  const addPlayerBtn = document.getElementById("addPlayerBtn");
  addPlayerBtn.addEventListener("click", addPlayer);
}

function addPlayer() {
  //Ingresa en sistema jugador a listado
  const inputPlayerName = document.getElementById("namePlayerText");
  inputPlayerName.value = inputPlayerName.value.replace(/[\W]+/g, "").trim(); //Quita espacios y símbolos
  if (inputPlayerName.value.length === 0) {
    showMsj("Please insert name. ❌", 2000, "error");
    //} else if(players.some((player) => player.namePlayer === namePlayerText)) {
  } else if (players.some((player) => player.name === inputPlayerName.value)) {
    showMsj("Name already exist. ❌", 2000, "error");
  } else {
    const jugador = new Player(inputPlayerName.value);
    inputPlayerName.value = "";
    players.push(jugador);
    saveRanking();
    showRankingDOM();
    showMsj(`Player added as '${jugador.name}'. ✅`, 3000, "confirm");
  }
}

function showMsj(msj, timeMilliseconds, type) {
  //Muestra mensajes emergentes
  let backgroundColor = {
    message: MSJMESSAGECOLOR,
    error: MSJERRORCOLOR,
    confirm: MSJCONFIRMCOLOR,
  };
  Toastify({
    // Librería utilizada para mostrar mensajes emergentes
    text: msj,
    duration: timeMilliseconds,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: backgroundColor[type] || "grey",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

function saveRanking() {
  //Graba Ranking de jugadores en LocalStorage
  localStorage.setItem("ranking", JSON.stringify(players));
}

function showRankingDOM() {
  //Muestra en pantalla listado de jugadores
  //Ordenamiento de listado de jugadores
  players.sort((player1, player2) => player2.bestScore - player1.bestScore);
  const ULPlayers = document.getElementById("ULPlayers");
  if (players.length === 0) {
    ULPlayers.innerHTML = "";
    const liVacia = document.createElement("li");
    liVacia.className = "LIVacia";
    liVacia.innerText = "No players created, please add one to begin.";
    ULPlayers.appendChild(liVacia);
  } else {
    ULPlayers.innerHTML = "";
    players.forEach((player) => {
      const liJugador = document.createElement("li");
      liJugador.className = "LIPlayer " + "LIPlayer" + player.ranking;
      liJugador.innerHTML =
        `${player.ranking}) ${player.name} - ${player.bestScore}pts. ` +
        `<input id='player${player.name}' type='button' value='Play' class='play player${player.name}'>`;
      ULPlayers.appendChild(liJugador);
    });
    showHidePlayStopBtns();
  }
}

function showHidePlayStopBtns() {
  //Muestra-oculta botones de "Jugar"
  const playBtns = document.getElementsByClassName("play");
  if (stage.playerName === "") {
    for (let btn of playBtns) {
      btn.classList.remove("d-none");
      btn.classList.add("btn-primary");
      btn.value = "Play";
      newBtn = btn.cloneNode(1);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener("click", () => {
        startStage(btn.id.substring(6));
      });
    }
  } else {
    for (let btn of playBtns) {
      if (!btn.classList.contains("player" + stage.playerName)) {
        btn.classList.add("d-none");
        btn.value = "-";
      } else {
        btn.classList.add("btn-danger");
        btn.value = "Stop stage";
        btn.classList.remove("d-none");
        newBtn = btn.cloneNode(1);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener("click", stopStage);
      }
    }
  }
}

function startStage(namePlayer) {
  //Comienza partida
  let player = players.find((player) => player.name === namePlayer);
  stage.playerName = player.name;
  stage.points = 0;
  stage.time = STAGETOTALSECONDS;
  showHidePlayStopBtns();
  initBoard();
}

function initBoard() {
  //Inicializa tablero
  const board = document.querySelectorAll(".box"); //Elementos posibles contenedores de topo
  board.forEach((square) => {
    //--Refactorizado
    square.addEventListener("click", function handlerInitBoard() {
      playerAttempt(square.id);
    });
  });
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.remove("d-none");
  const scoreboardPlayer = document.getElementById("scoreboardPlayer");
  scoreboardPlayer.innerText = stage.playerName;
  const scoreboardScore = document.getElementById("scoreboardScore");
  scoreboardScore.innerText = stage.points;
  const scoreboardTime = document.getElementById("scoreboardTime");
  scoreboardTime.innerText = stage.time;

  intervalTimer = setInterval(() => {
    //Inicializa cuenta regresiva
    stage.time--;
    scoreboardTime.innerText = stage.time;
    if (stage.time <= 0) {
      clearInterval(intervalTimer);
      stage.playerName != "" && stopStage();
    }
  }, 1000);
  setMoleControl();
}

function setMoleControl() {
  let variationMiliseconds =
    Math.floor(Math.random() * MOLESAPPEARMAXVARIATIONMILISECONDS) + 1;
  let moreOrLessTime = Math.floor(Math.random() * 2);
  let totalTimeAppear =
    MOLESAPPEARMILISECONDS +
    (moreOrLessTime ? variationMiliseconds : -variationMiliseconds);

  timeoutMole = setTimeout(() => { //Muestra topo al fin de timeout
    showMole();
    setMoleControl();
  }, totalTimeAppear);
  stage.timeoutsMoles.push(timeoutMole);
}

function showMole() {
  let posX = Math.floor(Math.random() * 3) + 1;
  let posY = Math.floor(Math.random() * 3) + 1;
  let querySelectors = "#i" + posX + "-" + posY + " img";
  let boxImage = document.querySelector(querySelectors);
  boxImage.src = IMGMOLE;
  boxImage.parentNode.classList.add('mole');
  boxImage.parentNode.classList.remove('miss');
  timeoutMole = setTimeout(() => { //Quita topo al fin de timeout
    boxImage.src = IMGCLEAR;
    boxImage.parentNode.classList.add('miss');
    boxImage.parentNode.classList.remove('mole');
    }, MOLEDISAPPEARMILISECONDS);
}

function stopStage() {
  //Detiene partida
  finishBoard();
  showRankingDOM();
  saveRanking();
}

function finishBoard() {
  //Restablece tablero
  clearInterval(intervalTimer);
  stage.timeoutsMoles.forEach(to => clearTimeout(to));
  const board = document.querySelectorAll(".box");
  for (let square of board) {
    square.parentNode.replaceChild(square.cloneNode(1), square); //Remueve eventos suplantando objeto
  }
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.classList.add("d-none");
  evaluateStage();
  stage.playerName = "";
  stage.points = 0;
  stage.time = 0;
  clearBoard();
  showRankingDOM();
}

function clearBoard(){
  //Libera tablero de imágenes y clases anteriores
  let boxes = document.querySelectorAll(".box");
  boxes.forEach(box => {
    box.childNodes[0].src = IMGCLEAR;
    box.classList.add('miss');
    box.classList.remove('mole');
  })
}

function evaluateStage() {
  let player = players.find((player) => player.name === stage.playerName);
  if (stage.points === player.bestScore) {
    //Mismo puntaje que anteriormente
    Swal.fire({
      title: "Great attempt",
      text: `Thanks for playing ${stage.playerName}, you got ${stage.points} points in this attempt.
      Maybe next time... 👍`,
      icon: "info",
      confirmButtonText: "Ok",
    });
  } else if (stage.points <= player.bestScore) {
    //Peor puntaje que ocasiones anteriores
    Swal.fire({
      title: "Good job!",
      text: `Thanks for playing ${stage.playerName}, you got ${stage.points} points in this attempt.
      Try your best next time... 😉`,
      icon: "warning",
      confirmButtonText: "Ok",
    });
  } else if (stage.points >= player.bestScore) {
    //Mejora puntaje de ocasiones anteriores
    Swal.fire({
      title: "EXCELLENT!!",
      text: `Thanks for playing ${stage.playerName}, you got ${stage.points} points in this attempt.
      You do it like a pro... 💪`,
      icon: "success",
      confirmButtonText: "Ok",
    });
    let player = players.find((player) => player.name === stage.playerName);
    player.bestScore = stage.points;
  }
}

function playerAttempt(cssId) {
  //Intento de atrapar topo
  const square = document.getElementById(cssId);
  if (square.classList.contains("mole")) { //Intento acertado
    stage.points += 3;
    let querySelectors = "#" + cssId + " img";
    let boxImage = document.querySelector(querySelectors);
    boxImage.src = IMGSMASHED;
    boxImage.parentNode.classList.add('miss');
    boxImage.parentNode.classList.remove('mole');
    timeoutMole = setTimeout(() => {
      boxImage.src = IMGCLEAR;
      }, MOLEATTEMPTDISAPPEARMILISECONDS);
  } else if (square.classList.contains("miss")) { //Intento errado
    stage.points -= 1;
    stage.points < 0 && (stage.points = 0); //No permite puntaje menor que cero.
    let querySelectors = "#" + cssId + " img";
    let boxImage = document.querySelector(querySelectors);
    boxImage.src = IMGMISS;
    boxImage.parentNode.classList.add('miss');
    boxImage.parentNode.classList.remove('mole');
    timeoutMole = setTimeout(() => {
      boxImage.src = IMGCLEAR;
      }, MOLEATTEMPTDISAPPEARMILISECONDS);
  }
  const scoreboradScore = document.getElementById("scoreboardScore");
  scoreboardScore.innerHTML = stage.points;
}

function test(msg) {
  //Testing
  console.log(msg);
}
