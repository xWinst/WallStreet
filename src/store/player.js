import { makeAutoObservable } from 'mobx';
// import cardDeck from 'db/cardDeck';
import cardDecks from 'db/cardDeck';
// const colors = ['blue', 'red', 'green', 'yellow'];

const bothDecks = new cardDecks();

const dealCards = (typeDeck, count) => {
    const result = [];
    const deck = bothDecks[typeDeck];
    // console.log('cardDeck[typeDeck]: ', cardDeck['bigDeck']);
    // const offset = typeDeck === 'bigDeck' ? 100 : 0;
    for (let i = 0; i < count; i++) {
        const rnd = Math.floor(Math.random() * deck.length);
        // console.log('rnd: ', rnd);
        result.push(deck[rnd].id);
        deck.splice(rnd, 1);
    }
    // console.log('result: ', result);

    return result;
};

class Player {
    name;
    money = 0;
    bigDeck;
    smallDeck;
    // bigDeck = [100, 101, 102, 110];
    // smallDeck = [0, 1, 5, 10, 11, 20];

    frezenShares = [0, 0, 0, 0];
    freeShares = [1, 1, 1, 1];

    constructor(name) {
        makeAutoObservable(this);
        this.name = name;
        this.bigDeck = dealCards('bigDeck', 4);
        this.smallDeck = dealCards('smallDeck', 6);
    }

    get shares() {
        const shares = [];
        for (let i = 0; i < this.frezenShares.length; i++) {
            shares[i] = this.frezenShares[i] + this.freeShares[i];
        }
        return shares;
    }

    removeCard = ({ id }) => {
        // console.log('id: ', id);
        if (id > 99) this.bigDeck = this.bigDeck.filter(card => card !== id);
        else this.smallDeck = this.smallDeck.filter(card => card !== id);
    };

    addMoney = amount => (this.money += amount);

    sellShares = sales => {
        for (let i = 0; i < sales.length; i++) {
            if (sales[i]) {
                this.freeShares[i] -= sales[i];
                if (this.freeShares[i] < 0) {
                    this.frezenShares[i] += this.freeShares[i];
                    this.freeShares[i] = 0;
                }
            }
        }
    };

    //Покупка на 3-м этапе тоже замораживает акции и тут же продать невозможно.

    buyShares = purchases => {
        for (let i = 0; i < purchases.length; i++) {
            if (purchases[i]) this.frezenShares[i] += purchases[i];
        }
    };

    shareMerger = () => {
        for (let i = 0; i < this.frezenShares.length; i++) {
            this.freeShares[i] += this.frezenShares[i];
            this.frezenShares[i] = 0;
        }
    };
}

export default Player;