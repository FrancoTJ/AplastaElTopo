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
  let list = localStorage.getItem("ranking") ? JSON.parse(localStorage.getItem("ranking")) : [];
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
    showMsj("Favor ingrese un nombre.");
    //} else if(ranking.players.some((player) => player.namePlayer === namePlayerText)) {
  } else if (
    ranking.players.some((player) => player.name === inputPlayerName.value)
  ) {
    showMsj("Nombre ya ingresado.");
  } else {
    const jugador = new Player(inputPlayerName.value);
    inputPlayerName.value = "";
    ranking.agregarJugador(jugador);
    saveRanking();
    showRankingDOM();
    showMsj("Usuario ingresado.");
  }
}

function showMsj(msj){
  Toastify({
    text: msj,
    duration: 2000,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function(){} // Callback after click
  }).showToast();
}

function saveRanking() {
  //Graba Ranking de jugadores en LocalStorage
  localStorage.removeItem("ranking");
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
    //showHidePlayStopBtns();
  }
}












function showHidePlayStopBtns() {
  //Muestra-oculta botones de "Jugar"
  const playBtns = document.getElementsByClassName("play");
  if (stage.playerName === "") {
    for (let btn of playBtns) {
      btn.classList.remove("d-none");
      btn.value = "Jugar";
      btn.addEventListener("click", startStage);
    }
  } else {
    //console.log("---ELSE---");
    for (let btn of playBtns) {
      if (!btn.classList.contains("player" + stage.playerName)) {
        //        console.log("Invisible");
        btn.classList.add("d-none");
        btn.value = "-";
      } else {
        //        console.log("Detener");
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
  console.log("startStage");
  // console.log(namePlayer.target.id);

  let player = ranking.players.find((player) => player.name === namePlayer);
  console.log(player);
  //console.log(player.name);
  console.log("POST player");
  stage.attempts = 10;
  //stage.playerName = player.name;
  console.log(stage);
  showHidePlayStopBtns();
  //initBoard();
}

function initBoard() {
  //Inicializa tablero
}

function stopStage() {
  console.log("Detenido Juego");
  // stage.attempts = 0;
  // stage.playerName = "";
  // saveRanking();
  // showRankingDOM();
}

function test(msg){ //Función de pruebas
  console.log(msg);
}











