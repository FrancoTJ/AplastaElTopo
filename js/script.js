//let opcionSeleccionada;
//let jugadorActual;

init();

function init() { //Carga datos y funcionalidad de APP
  loadSave();
  agregarEventos();

  // TEST
  // let p1 = new Jugador("JuanP1");
  // ranking.agregarJugador(p1);
  // let p2 = new Jugador("MarioP2");
  // ranking.agregarJugador(p2);
  // let p3 = new Jugador("LuigiP3");
  // ranking.agregarJugador(p3);
  mostrarRankingEnDOM();
}
//----------AGREGAR EVENTOS----------

function agregarEventos() { //Agrega eventos a los elementos que lo requieran
  //Evento agregar jugador
  const addPlayerBtn = document.getElementById("addPlayerBtn");
  addPlayerBtn.addEventListener("click", agregarJugador);
}

//----------FIN AGREGAR EVENTOS----------

function loadSave() { //Carga de LocalStorage si ya existen datos previos
  console.log(ranking.jugadores);
  if (localStorage.getItem("ranking")) {
    console.log("Carga JSON existente");
    ranking.jugadores = JSON.parse(localStorage.getItem("ranking"));
  } else {
    console.log("NO hay datos almacenados previamente.");
  }
}

function mostrarRankingEnDOM() { //Muestra en pantalla listado de jugadores
  const ULPlayers = document.getElementById("ULPlayers");
  if (ranking.jugadores.length === 0) {
    console.log("Sin datos a cargar");
    ULPlayers.innerHTML = "";
    const liVacia = document.createElement("li");
    liVacia.className = "LIVacia";
    liVacia.innerText =
      "No hay Jugadores creados, favor crear uno para comenzar.";
    ULPlayers.appendChild(liVacia);
  } else {
    console.log("Se cargan los datos a cargar");
    ULPlayers.innerHTML = "";
    ranking.jugadores.forEach((jugador) => {
      const liJugador = document.createElement("li");
      liJugador.className = "LIPlayer " + "LIPlayer" + jugador.posicion;
      liJugador.innerHTML =
        jugador.posicion +
        ") " +
        jugador.nombre +
        " - " +
        jugador.puntaje +
        "pts.";
      ULPlayers.appendChild(liJugador);
    });
  }
}

function agregarJugador() { //Agrega un Jugador en sistema y muestra en pantalla pantalla
  insertPlayer();
  grabarRanking();
  mostrarRankingEnDOM();
}

function insertPlayer() { //Ingresa en sistema jugador a listado
  const namePlayerText = document.getElementById("namePlayerText");
  const jugador = new Jugador(namePlayerText.value);
  namePlayerText.value = "";
  ranking.agregarJugador(jugador);
}

function grabarRanking() { //Graba Ranking de jugadores en LocalStorage
  localStorage.removeItem("ranking");
  localStorage.setItem("ranking", JSON.stringify(ranking.jugadores));
}
/*
function iniciarPartida() {
  let nroJugadorBuscado = parseInt(prompt("Ingrese número de jugador"));
  if (
    ranking.jugadores.some((jugador) => jugador.posicion === nroJugadorBuscado)
  ) {
    jugadorActual = ranking.jugadores[nroJugadorBuscado - 1];
    console.log("Jugador encontrado");
  } else {
    console.log("Jugador no encontrado");
    jugadorActual = undefined;
  }
}

function sumarMarcador(jugador) {
  ranking.jugadores[jugador.posicion - 1].puntaje += 1;
  console.log(
    `Jugador ${jugador.posicion}-${jugador.nombre} se le agrega un punto.`
  );
}

function restarMarcador(jugador) {
  if (ranking.jugadores[jugador.posicion - 1].puntaje > 0) {
    ranking.jugadores[jugador.posicion - 1].puntaje -= 1;
  }
  console.log(
    `Jugador ${jugador.posicion}-${jugador.nombre} se le resta un punto.`
  );
}
*/
