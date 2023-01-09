import Card from './card';
const colors = ['blue', 'red', 'green', 'yellow'];
const bigCardTypes = ['doubble', '100'];
const smallCardTypes = ['30', '40', '50', '60'];

class cardDecks {
    constructor() {
        this.bigDeck = this.getDeck(bigCardTypes, 100);
        this.smallDeck = this.getDeck(smallCardTypes);
    }

    getDeck(cardTypes, id = 0) {
        const result = [];
        for (let i = 0; i < colors.length; i++) {
            for (const type of cardTypes) {
                if (type === '100') {
                    for (let j = 0; j < 3; j++) {
                        result.push(new Card(i, true, type, id++));
                    }
                } else {
                    result.push(new Card(i, true, type, id++));
                    result.push(new Card(i, false, type, id++));
                }
            }
        }
        return result;
    }
}

export default new cardDecks();
