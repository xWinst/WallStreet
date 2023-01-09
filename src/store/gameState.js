import { makeAutoObservable } from 'mobx';
import Player from 'store/player';

class Game {
    currentPrice = [100, 100, 100, 100];
    futurePrice = [0, 0, 0, 0];
    currentCard = null;
    players;
    gameState = 'before';
    turn = 1;

    constructor(players) {
        makeAutoObservable(this);
        this.players = players;
    }

    setCurrentPrice = price => (this.currentPrice = price);
    setFuturePrice = price => (this.futurePrice = price);
    changeFuturePrice = (index, value) => (this.futurePrice[index] = value);
    setCurrentCard = card => (this.currentCard = card);
    setGameState = state => (this.gameState = state);
    nextTurn = () => this.turn++;
}

// const player = new Player('Anonymus');
// const game = new Game([player]);

export default Game;
