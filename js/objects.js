class Ranking {
  constructor() {
    this.players = [];
  }
  ordenarJugadores() {
    console.log("Pendiente ordenamiento");
  }
  agregarJugador(jugador) {
    this.players.push(jugador);
  }
}

class Player {
  constructor(name) {
    this.ranking = ranking.players.length + 1;
    this.name = name;
    this.points = 0;
  }
}

class Stage { //Registra los datos de partida actual
  constructor(attempts, playerName) { 
    this.attempts = attempts; //Intentos restantes
    this.playerName = playerName; //Jugador actual
    this.points = 0; //Puntos totales de la partida
  }
}

