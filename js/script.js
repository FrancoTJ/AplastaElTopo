let opcionSeleccionada;
let jugadorActual;

do {
  menu();
} while (opcionSeleccionada != 0);

function menu() {
  let textoMenu = `1-Mostrar Ranking
2-Crear Jugador
3-Iniciar Juego
4-Mostrar Jugador actual
5-Sumar punto a jugador actual
6-Restar punto a jugador actual
0-Salir`;
  opcionSeleccionada = solicitarNumero(textoMenu);
  if (!isNaN(opcionSeleccionada)) {
    switch (opcionSeleccionada) {
      case 1:
        console.log("abc");
        mostrarRanking();
        break;
      case 2:
        crearJugador();
        break;
      case 3:
        iniciarPartida();
        break;
      case 4:
        console.log(jugadorActual);
        break;
      case 5:
        sumarMarcador(jugadorActual);
        break;
        case 6:
          restarMarcador(jugadorActual);
          break;
      case 0:
        break; //Culmina menú
      default:
        alert("Opción incorrecta, favor reintentar");
    }
  }
}

function solicitarNumero(textoSolicitud) {
  let numeroSeleccionado = parseInt(prompt(textoSolicitud));
  let numeroRetornado;
  if (isNaN(numeroSeleccionado)) {
    alert("Error, debe ingresar un número");
    numeroRetornado = undefined;
  } else {
    numeroRetornado = numeroSeleccionado;
  }
  return numeroRetornado;
}

function mostrarRanking() {

  let ULJugadores = document.getElementById("listPlayers");
  ULJugadores.innerHTML = 'Hola JS';
  console.log(ULJugadores);
  // if(ranking.jugadores.length == 0){
  //   ULJugadores.innerHTML = "<span>No olvides ingresar tu jugador antes de comenzar.</span>"
  // } else{
  //   ranking.jugadores.forEach((jugador)=>ULJugadores.innerHTML+=`${jugador.posicion}-${jugador.nombre} - ${jugador.puntaje}pts.`)
  // }


  // ranking.jugadores.forEach((jugador) =>
  //   console.log(
  //     jugador.posicion + "-" + jugador.nombre + "-" + jugador.puntaje + "pts."
  //   )
  // );
}

function crearJugador() {
  const jugador = new Jugador(prompt("Ingrese nombre de jugador:"));
  ranking.agregarJugador(jugador);
  console.log(jugador);
}

function iniciarPartida() {
  let nroJugadorBuscado = parseInt(prompt("Ingrese número de jugador"));
  if (
    ranking.jugadores.some((jugador) => jugador.posicion === nroJugadorBuscado)
  ) {
    jugadorActual = ranking.jugadores[nroJugadorBuscado-1];
    console.log("Jugador encontrado");
  } else {
    console.log("Jugador no encontrado");
    jugadorActual = undefined;
  }
}

function sumarMarcador(jugador) {
  ranking.jugadores[jugador.posicion-1].puntaje+=1;
  console.log(`Jugador ${jugador.posicion}-${jugador.nombre} se le agrega un punto.`);
}

function restarMarcador(jugador) {
  if (ranking.jugadores[jugador.posicion-1].puntaje > 0){
    ranking.jugadores[jugador.posicion-1].puntaje-=1;
  }
  console.log(`Jugador ${jugador.posicion}-${jugador.nombre} se le resta un punto.`);
}

console.log("Game over...");
