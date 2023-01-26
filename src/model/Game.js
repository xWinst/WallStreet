import CardDecks from './CardDecks';

class Game {
    currentPrice = [100, 100, 100, 100];
    // futurePrice = [0, 0, 0, 0];
    // currentCard = null;
    players = [];
    turn = 1;
    stage = 'before';
    companyColors = ['blue', 'red', 'green', 'yellow'];
    companyNames = ['Cиние', 'Красные', 'Зеленые', 'Желтые'];

    constructor() {
        this.bothDecks = new CardDecks(this.companyColors);
        this.gameDecks = new CardDecks(this.companyColors);
    }

    nextTurn = () => this.turn++;
    nextStage = () => {
        this.stage = 'after';
        return this.stage;
    };

    reset = () => {
        this.currentPrice = [100, 100, 100, 100];
        this.players = [];
        this.gameState = 'before';
        this.turn = 1;
        this.gameDecks = new CardDecks(this.companyColors);
    };
}

const game = new Game();

export default game;
