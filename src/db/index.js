const aiNames = ['Я есть Мозг', 'Идиот', 'Болван', 'Дебил'];
const bigCardTypes = ['doubble', '100'];
const smallCardTypes = ['30', '40', '50', '60'];
export const companyColors = ['blue', 'red', 'yellow', 'green'];
export const companyNames = ['Cиние', 'Красные', 'Желтые', 'Зеленые'];

export const getName = list => {
    let index = Math.floor(Math.random() * aiNames.length);
    const nameList = list.map(({ name }) => name);
    // console.log('nameList: ', nameList);
    while (nameList.includes(aiNames[index])) {
        index = index === aiNames.length - 1 ? 0 : index + 1;
    }

    return aiNames[index];
};

// const getShares = (frezenShares, freeShares) => {
//     const shares = [];
//     for (let i = 0; i < frezenShares.length; i++) {
//         shares[i] = frezenShares[i] + freeShares[i];
//     }
//     return shares;
// };

const getCard = (color, isBoostCard, type, id) => {
    return { color, isBoostCard, type, id };
};

export const getCardById = id => {
    const color = id < 100 ? Math.floor(id / 8) : Math.floor((id % 100) / 5);
    const isBoostCard = id < 100 ? !!(id % 2) : !!(id % 5);
    const type =
        id < 100
            ? `${30 + 10 * Math.floor((id % 8) / 2)}`
            : id % 5 > 1
            ? '100'
            : 'doubble';

    return { color, isBoostCard, type, id };
};

const getDeck = (numberCompanies, cardTypes, id = 0) => {
    const result = [];
    for (let i = 0; i < numberCompanies; i++) {
        for (const type of cardTypes) {
            if (type === '100') {
                for (let j = 0; j < 3; j++) {
                    result.push(getCard(i, true, type, id++));
                }
            } else {
                result.push(getCard(i, false, type, id++));
                result.push(getCard(i, true, type, id++));
            }
        }
    }
    return result;
};

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

export const createGame = ({
    players,
    firstPlayerIdx,
    numberCompanies = 4,
    numberBigCards = 4,
    numberSmallCards = 6,
}) => {
    const deks = {
        bigDeck: getDeck(numberCompanies, bigCardTypes, 100),
        smallDeck: getDeck(numberCompanies, smallCardTypes),
    };

    const createPlayer = (name, avatar) => {
        return {
            name,
            avatar,
            money: 0,
            frezenShares: [0, 0, 0, 0],
            freeShares: [1, 1, 1, 1],
            bigDeck: dealCards(deks, 'bigDeck', numberBigCards),
            smallDeck: dealCards(deks, 'smallDeck', numberSmallCards),
        };
    };

    let newPlayers = players.map(({ name, avatar }) =>
        createPlayer(name, avatar)
    );

    if (firstPlayerIdx) {
        newPlayers = newPlayers
            .slice(firstPlayerIdx)
            .concat(newPlayers.slice(0, firstPlayerIdx));
    }

    return { players: newPlayers };
};

export const sellShares = (player, sales, price) => {
    // let money = player.money;
    // const freeShares = [...player.freeShares];
    // const frezenShares = [...player.frezenShares];

    // for (let i = 0; i < sales.length; i++) {
    //     if (sales[i]) {
    //         freeShares[i] -= sales[i];
    //         money += sales[i] * price[i];
    //         if (freeShares[i] < 0) {
    //             frezenShares[i] += player.freeShares[i];
    //             freeShares[i] = 0;
    //         }
    //     }
    // }

    // const shares = getShares(frezenShares, freeShares);

    let money = player.money;
    const shares = [...player.shares];

    for (let i = 0; i < sales.length; i++) {
        if (sales[i]) {
            shares[i] -= sales[i];
            money += sales[i] * price[i];
        }
    }

    return { money, shares };
};

export const buyShares = (player, purchases, price) => {
    // let money = player.money;
    // const frezenShares = [...player.frezenShares];
    // const freeShares = [...player.freeShares];

    // for (let i = 0; i < purchases.length; i++) {
    //     if (purchases[i]) {
    //         money -= purchases[i] * price[i];
    //         if (stage === 'before') frezenShares[i] += purchases[i];
    //         else freeShares[i] += purchases[i];
    //     }
    // }
    // const shares = getShares(frezenShares, freeShares);

    let money = player.money;
    const shares = [...player.shares];

    for (let i = 0; i < purchases.length; i++) {
        if (purchases[i]) {
            shares[i] += purchases[i];
            money -= purchases[i] * price[i];
        }
    }

    return { money, shares };
};

export const updateShares = (player, changes, price) => {
    let money = player.money;
    const shares = [...player.shares];

    for (let i = 0; i < changes.length; i++) {
        if (changes[i]) {
            shares[i] += changes[i];
            money -= changes[i] * price[i];
        }
    }

    return { money, shares };
};

export const shareMerger = player => {
    const freeShares = [...player.freeShares];
    const frezenShares = [...player.frezenShares];

    for (let i = 0; i < frezenShares.length; i++) {
        freeShares[i] += player.frezenShares[i];
        frezenShares[i] = 0;
    }
    return { freeShares, frezenShares };
};

export const getColors = card => {
    let colorUp;
    let colorDown;
    if (card.isBoostCard) {
        colorUp = [card.color];
        colorDown = [0, 1, 2, 3].filter(idx => idx !== card.color);
    } else {
        colorUp = [0, 1, 2, 3].filter(idx => idx !== card.color);
        colorDown = [card.color];
    }

    return { colorUp, colorDown };
};

export const activateCard = (card, price, secondColor, thirdColor) => {
    const activePrice = [...price];
    const isBoostCard = card.isBoostCard;
    if (card.type === 'doubble') {
        activePrice[card.color] *= isBoostCard ? 2 : 0.5;
        activePrice[secondColor] *= isBoostCard ? 0.5 : 2;
    } else if (card.type === '100') {
        const { colorDown } = getColors(card);
        activePrice[card.color] += 100;
        activePrice[secondColor] -= 10;
        activePrice[thirdColor] -= 20;
        activePrice[
            colorDown.filter(
                color => color !== secondColor && color !== thirdColor
            )
        ] -= 30;
    } else {
        const value = Number.parseInt(card.type);
        activePrice[card.color] += isBoostCard ? value : value - 90;
        activePrice[secondColor] += isBoostCard ? value - 90 : value;
    }
    return activePrice;
};
