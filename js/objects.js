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
const ranking = new Ranking();

class Player {
  constructor(name) {
    this.ranking = ranking.players.length + 1;
    this.name = name;
    this.points = 0;
  }
}

class Stage {
  constructor(attempts, playerName) {
    this.attempts = attempts;
    this.playerName = playerName;
  }
}

