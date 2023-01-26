import Card from './Card';

const bigCardTypes = ['doubble', '100'];
const smallCardTypes = ['30', '40', '50', '60'];

class CardDecks {
    constructor(colors) {
        this.colors = colors;
        this.bigDeck = this.getDeck(bigCardTypes, 100);
        this.smallDeck = this.getDeck(smallCardTypes);
    }

    getDeck(cardTypes, id = 0) {
        const result = [];
        for (let i = 0; i < this.colors.length; i++) {
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

export default CardDecks;
