const dealCards = (bothDecks, typeDeck, count) => {
    // console.log('bothDecks: ', bothDecks);
    const result = [];
    const deck = bothDecks[typeDeck];
    for (let i = 0; i < count; i++) {
        const rnd = Math.floor(Math.random() * deck.length);
        result.push(deck[rnd].id);
        deck.splice(rnd, 1);
    }
    return result;
};

class Player {
    static count = 0;

    name;
    money = 0;
    bigDeck;
    smallDeck;
    // bigDeck = [100, 101, 102, 110];
    // smallDeck = [0, 1, 5, 10, 11, 20];

    frezenShares = [0, 0, 0, 0];
    freeShares = [1, 1, 1, 1];

    constructor(name, decks) {
        if (name) {
            this.name = name;
            this.bigDeck = dealCards(decks, 'bigDeck', 4);
            this.smallDeck = dealCards(decks, 'smallDeck', 6);
        }
        this.index = Player.count;
        Player.count++;
    }

    get shares() {
        const shares = [];
        for (let i = 0; i < this.frezenShares.length; i++) {
            shares[i] = this.frezenShares[i] + this.freeShares[i];
        }
        return shares;
    }

    get copy() {
        return {
            index: this.index,
            name: this.name,
            money: this.money,
            bigDeck: this.bigDeck,
            smallDeck: this.smallDeck,
            // frezenShares: this.frezenShares,
            // freeShares: this.freeShares,
        };
    }

    getTotal = price => {
        let result = this.money;
        for (let i = 0; i < this.frezenShares.length; i++) {
            result += (this.frezenShares[i] + this.freeShares[i]) * price[i];
        }
        return result;
    };

    loadState = player => {
        this.name = player.name;
        this.money = player.money;
        this.bigDeck = player.bigDeck;
        this.smallDeck = player.smallDeck;
        this.frezenShares = player.frezenShares;
        this.freeShares = player.freeShares;
    };

    removeCard = id => {
        // console.log('id: ', id);
        if (id > 99) {
            this.bigDeck = this.bigDeck.filter(card => card !== id);
            return { index: this.index, bigDeck: this.bigDeck };
        } else {
            this.smallDeck = this.smallDeck.filter(card => card !== id);
            return { index: this.index, smallDeck: this.smallDeck };
        }
    };

    // addMoney = amount => (this.money += amount);

    sellShares = (sales, price) => {
        for (let i = 0; i < sales.length; i++) {
            if (sales[i]) {
                this.freeShares[i] -= sales[i];
                this.money += sales[i] * price[i];
                if (this.freeShares[i] < 0) {
                    this.frezenShares[i] += this.freeShares[i];
                    this.freeShares[i] = 0;
                }
            }
        }

        return {
            index: this.index,
            money: this.money,
            // freeShares: this.freeShares,
            // frezenShares: this.frezenShares,
        };
    };

    //Покупка на 3-м этапе тоже замораживает акции и тут же продать невозможно.

    buyShares = (purchases, price) => {
        for (let i = 0; i < purchases.length; i++) {
            if (purchases[i]) {
                this.money -= purchases[i] * price[i];
                this.frezenShares[i] += purchases[i];
            }
        }

        return {
            index: this.index,
            money: this.money,
            // frezenShares: this.frezenShares,
        };
    };

    shareMerger = () => {
        for (let i = 0; i < this.frezenShares.length; i++) {
            this.freeShares[i] += this.frezenShares[i];
            this.frezenShares[i] = 0;
        }

        // return { freeShares: this.freeShares, frezenShares: this.frezenShares };
    };
}

export default Player;
