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
  inputPlayerName.value = inputPlayerName.value.replace(/[\W]+/g,"").trim(); //Quita espacios y símbolos
  if (inputPlayerName.value.length === 0) {
    showMsj("Please insert name. ❌", 2000, "error");
    //} else if(players.some((player) => player.namePlayer === namePlayerText)) {
  } else if (
    players.some((player) => player.name === inputPlayerName.value)
  ) {
    showMsj("Name already exist. ❌", 2000, "error");
  } else {
    const jugador = new Player(inputPlayerName.value);
    inputPlayerName.value = "";
    players.push(jugador)
    saveRanking();
    showRankingDOM();
    showMsj(`Player added as '${jugador.name}'. ✅`, 3000, "confirm");
  }
}

function showMsj(msj, timeMilliseconds, type) {
  let backgroundColor = {
    message: "#90e0ef",
    error: "#f28482",
    confirm : "#81b29a"
  };

  Toastify({
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
  const ULPlayers = document.getElementById("ULPlayers");
  if (players.length === 0) {
    ULPlayers.innerHTML = "";
    const liVacia = document.createElement("li");
    liVacia.className = "LIVacia";
    liVacia.innerText =
      "No players created, please add one to begin.";
    ULPlayers.appendChild(liVacia);
  } else {
    ULPlayers.innerHTML = "";
    players.forEach((player) => {
      const liJugador = document.createElement("li");
      liJugador.className = "LIPlayer " + "LIPlayer" + player.ranking;
      liJugador.innerHTML =
        `${player.ranking}) ${player.name} - ${player.points}pts. ` +
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
  let player = players.find((player) => player.name === namePlayer);
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
  let player = players.find(
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
    showMsj(`Intentos: ${stage.attempts}`, 500, "confirm");
  }
  showRankingDOM();
}

function stopStage() {
  finishBoard();
  showMsj(
    `Gracias por jugar ${stage.playerName}, has obtenido ${stage.points} puntos en esta partida.`,
    6000, "confirm"
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
