class Ranking {
  constructor() {
    this.jugadores = [];
  }
  ordenarJugadores() {
    console.log("Pendiente ordenamiento");
  }
  agregarJugador(jugador) {
    this.jugadores.push(jugador);
  }
}
let ranking = new Ranking();

class Jugador {
  constructor(nombre) {
    this.posicion = ranking.jugadores.length + 1;
    this.nombre = nombre;
    this.puntaje = 0;
  }
}
