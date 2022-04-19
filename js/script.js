//let opcionSeleccionada;
//let jugadorActual;
let stage = new Stage(0, "");

init();

function startStage(namePlayer) {
  //Comienza partida
  //Inicia Partida de un jugador
  console.log("startStage");
  console.log(ranking.players);
  let player = ranking.players.find((player) => player.name === namePlayer);
  console.log(player.name);
  console.log("POST player");
  stage.attempts = 10;
  stage.playerName = player.name;
  console.log(stage);
  showHidePlayStopBtns();
  //initBoard();
}

function initBoard() {
  //Inicializa tablero
}

function showHidePlayStopBtns() {
  //Muestra-oculta botones de "Jugar"
  console.log("Entra: " + stage.playerName);
  
  const playBtns = document.getElementsByClassName("play");
  if (stage.playerName === "") {
    for (let btn of playBtns) {
      btn.classList.remove("d-none");
      btn.value = "Jugar";
      btn.addEventListener("click", startStage);
    }
  } else { console.log("---ELSE---");
    for (let btn of playBtns) {
      if (!btn.classList.contains("player" + stage.playerName)) {
        console.log("Invisible");
        // btn.classList.add("d-none");
        // btn.value = "-";
      } else {
        console.log("Detener");
        // btn.classList.remove("d-none");
        // btn.value = "Detener";
        // //btn.addEventListener("click", stopStage);
      }
    }
  }
  console.log("Sale");
}

function stopStage() {
  console.log("Detenido Juego");
  // stage.attempts = 0;
  // stage.playerName = "";
  // saveRanking();
  // showRankingDOM();
}

function init() {
  //Carga datos y funcionalidad de APP
  loadSave();
  addEvent();


  // TEST
  // let p1 = new Jugador("JuanP1");
  // ranking.agregarJugador(p1);
  // let p2 = new Jugador("MarioP2");
  // ranking.agregarJugador(p2);
  // let p3 = new Jugador("LuigiP3");
  // ranking.agregarJugador(p3);
  showRankingDOM();
}
//----------AGREGAR EVENTOS----------

function addEvent() {
  //Agrega eventos a los elementos que lo requieran
  //Evento agregar jugador
  const addPlayerBtn = document.getElementById("addPlayerBtn");
  addPlayerBtn.addEventListener("click", addPlayer);
}

//----------FIN AGREGAR EVENTOS----------

function loadSave() {
  //Carga de LocalStorage si ya existen datos previos
  if (localStorage.getItem("ranking")) {
    ranking.players = JSON.parse(localStorage.getItem("ranking"));
  }
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
        player.ranking +
        ") " +
        player.name +
        " - " +
        player.points +
        "pts. " +
        "<input type='button' value='Jugar' class='play player" +
        player.name +
        "' onclick='startStage(`" +
        player.name +
        "`)'>";
      ULPlayers.appendChild(liJugador);
    });
    showHidePlayStopBtns();
  }
}

function addPlayer() {
  //Ingresa en sistema jugador a listado
  const inputPlayerName = document.getElementById("namePlayerText");
  console.log("Input: " + inputPlayerName.value);
  //  console.log(ranking.players.some(player => player.name === namePlayerText));
  if (inputPlayerName.value.length === 0) {
    showMsg("Favor ingrese un nombre.");
    //} else if(ranking.players.some((player) => player.namePlayer === namePlayerText)) {
  } else if (
    ranking.players.some((player) => player.name === inputPlayerName.value)
  ) {
    showMsg("Nombre ya ingresado.");
  } else {
    const jugador = new Player(inputPlayerName.value);
    inputPlayerName.value = "";
    ranking.agregarJugador(jugador);
    saveRanking();
    showRankingDOM();
    showMsg("Usuario ingresado.");
  }
}

function showMsg(textToShow) {
  //Muestra resultado en pantalla pantalla
  console.log(textToShow);
  const responseLbl = document.getElementById("responseAddPlayerBtn");
  responseLbl.innerText = textToShow;
}

function saveRanking() {
  //Graba Ranking de jugadores en LocalStorage
  localStorage.removeItem("ranking");
  localStorage.setItem("ranking", JSON.stringify(ranking.players));
}
/*
function iniciarPartida() {
  let nroJugadorBuscado = parseInt(prompt("Ingrese número de jugador"));
  if (
    ranking.players.some((jugador) => jugador.posicion === nroJugadorBuscado)
  ) {
    jugadorActual = ranking.players[nroJugadorBuscado - 1];
    console.log("Jugador encontrado");
  } else {
    console.log("Jugador no encontrado");
    jugadorActual = undefined;
  }
}

function sumarMarcador(jugador) {
  ranking.players[jugador.posicion - 1].puntaje += 1;
  console.log(
    `Jugador ${jugador.posicion}-${jugador.nombre} se le agrega un punto.`
  );
}

function restarMarcador(jugador) {
  if (ranking.players[jugador.posicion - 1].puntaje > 0) {
    ranking.players[jugador.posicion - 1].puntaje -= 1;
  }
  console.log(
    `Jugador ${jugador.posicion}-${jugador.nombre} se le resta un punto.`
  );
}
*/