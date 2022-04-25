const ranking = new Ranking();
let stage = new Stage(0, "");

init();

function init() {
  //Carga datos y funcionalidad de APP
  loadSave();
  addEventNewPlayer();
  showRankingDOM();
}

function loadSave() {
  //Carga de LocalStorage si ya existen datos previos
  let list = localStorage.getItem("ranking")
    ? JSON.parse(localStorage.getItem("ranking"))
    : [];
  ranking.players = list;
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
  inputPlayerName.value = inputPlayerName.value.trim();
  if (inputPlayerName.value.length === 0) {
    showMsj("Favor ingrese un nombre.", 2000);
    //} else if(ranking.players.some((player) => player.namePlayer === namePlayerText)) {
  } else if (
    ranking.players.some((player) => player.name === inputPlayerName.value)
  ) {
    showMsj("Nombre ya ingresado.", 2000);
  } else {
    const jugador = new Player(inputPlayerName.value);
    inputPlayerName.value = "";
    ranking.agregarJugador(jugador);
    saveRanking();
    showRankingDOM();
    showMsj("Usuario ingresado.", 3000);
  }
}

function showMsj(msj, timeMilliseconds) {
  Toastify({
    text: msj,
    duration: timeMilliseconds,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

function saveRanking() {
  //Graba Ranking de jugadores en LocalStorage
  localStorage.setItem("ranking", JSON.stringify(ranking.players));
}

function showRankingDOM() {
  //Muestra en pantalla listado de jugadores
  const ULPlayers = document.getElementById("ULPlayers");
  if (ranking.players.length === 0) {
    ULPlayers.innerHTML = "";
    const liVacia = document.createElement("li");
    liVacia.className = "LIVacia";
    liVacia.innerText =
      "No hay Jugadores creados, favor crear uno para comenzar.";
    ULPlayers.appendChild(liVacia);
  } else {
    ULPlayers.innerHTML = "";
    ranking.players.forEach((player) => {
      const liJugador = document.createElement("li");
      liJugador.className = "LIPlayer " + "LIPlayer" + player.ranking;
      liJugador.innerHTML =
        `${player.ranking}) ${player.name} - ${player.points}pts. ` +
        `<input id='player${player.name}' type='button' value='Jugar' class='play player${player.name}'>`;
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
      btn.value = "Jugar";
      btn.addEventListener("click", () => {
        startStage(btn.id.substring(6));
      });
    }
  } else {
    for (let btn of playBtns) {
      if (!btn.classList.contains("player" + stage.playerName)) {
        btn.classList.add("d-none");
        btn.value = "-";
      } else {
        btn.classList.remove("d-none");
        btn.value = "Detener";
        btn.addEventListener("click", stopStage);
      }
    }
  }
}

function startStage(namePlayer) {
  //Comienza partida
  //Inicia Partida de un jugador
  let player = ranking.players.find((player) => player.name === namePlayer);
  stage.attempts = 10;
  stage.playerName = player.name;
  stage.points = 0;
  showHidePlayStopBtns();
  initBoard();
}

function initBoard() {
  const board = document.querySelectorAll(".box");
  for (let square of board) {
    square.addEventListener("click", function handlerInitBoard() {
      playerCatch(square.id);
    });
  }
}

function playerCatch(positionId) {
  const square = document.getElementById(positionId);
  let player = ranking.players.find(
    (player) => player.name === stage.playerName
  );
  if (square.classList.contains("topo")) {
    player.points += 3;
    stage.points += 3;
  } else if (square.classList.contains("miss")) {
    player.points -= 1;
    stage.points -= 1;
    player.points < 0 && (player.points = 0); //No permite puntaje menor que cero.
  }
  stage.attempts--;
  if (stage.attempts === 0) {
    stopStage();
  } else {
    showMsj(`Intentos: ${stage.attempts}`);
  }
  showRankingDOM();
}

function stopStage() {
  finishBoard();
  showMsj(
    `Gracias por jugar ${stage.playerName}, has obtenido ${stage.points} puntos en esta partida.`,
    6000
  );
  stage.attempts = 0;
  stage.playerName = "";
  saveRanking();
  showRankingDOM();
}

function finishBoard() {
  const board = document.querySelectorAll(".box");
  for (let square of board) {
    square.parentNode.replaceChild(square.cloneNode(1), square); //Remueve eventos suplantando objeto
  }
}

function test(msg) {
  //Función de pruebas
  console.log(msg);
}
