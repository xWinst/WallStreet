export const removeCard = (id, player) => {
    if (id > 99) return { bigDeck: player.bigDeck.filter(card => card !== id) };
    else return { smallDeck: player.smallDeck.filter(card => card !== id) };
};

// export const addMoney = (amount, player) => {
//     return { money: player.money + amount };
// };

export const sellShares = (sales, price, player) => {
    const freeShares = [...player.freeShares];
    const frezenShares = [...player.frezenShares];
    let money = player.money;
    for (let i = 0; i < sales.length; i++) {
        if (sales[i]) {
            freeShares[i] = player.freeShares[i] - sales[i];
            money += sales[i] * price[i];
            if (player.freeShares[i] < 0) {
                frezenShares[i] = player.frezenShares[i] + player.freeShares[i];
                freeShares[i] = 0;
            }
        }
    }

    return { money, freeShares, frezenShares };
};

//Покупка на 3-м этапе тоже замораживает акции и тут же продать невозможно.

export const buyShares = (purchases, price, player) => {
    const frezenShares = [...player.frezenShares];
    let money = player.money;
    for (let i = 0; i < purchases.length; i++) {
        if (purchases[i]) {
            money -= purchases[i] * price[i];
            frezenShares[i] = player.frezenShares[i] + purchases[i];
        }
    }
    return { money, frezenShares };
};

export const shareMerger = player => {
    const freeShares = [...player.freeShares];
    const frezenShares = [...player.frezenShares];

    for (let i = 0; i < player.frezenShares.length; i++) {
        freeShares[i] = player.freeShares[i] + player.frezenShares[i];
        frezenShares[i] = 0;
    }

    return { freeShares, frezenShares };
};

export const getShares = player => {
    const result = [];
    for (let i = 0; i < player.frezenShares.length; i++) {
        result[i] = player.frezenShares[i] + player.freeShares[i];
    }
    return result;
};
