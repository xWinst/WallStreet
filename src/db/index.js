const aiNames = ['Я есть Мозг', 'Идиот', 'Болван', 'Дебил'];
export const companyColors = ['blue', 'red', 'yellow', 'green'];
export const companyNames = ['Cиние', 'Красные', 'Желтые', 'Зеленые'];

export const getName = list => {
    let index = Math.floor(Math.random() * aiNames.length);
    const nameList = list.map(({ name }) => name);

    while (nameList.includes(aiNames[index])) {
        index = index === aiNames.length - 1 ? 0 : index + 1;
    }

    return aiNames[index];
};

export const getActions = (prevShares, shares) => {
    console.log('prevShares: ', prevShares);
    console.log('shares: ', shares);
    const sales = [0, 0, 0, 0];
    const purchases = [0, 0, 0, 0];
    for (let i = 0; i < shares.length; i++) {
        const result = shares[i] - prevShares[i];
        if (result > 0) purchases[i] = result;
        else sales[i] = -result;
    }

    return { sales, purchases, shares };
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

export const applyBonuses = (name, players, bonuses, fines, compensations) => {
    const updatedPlayers = [];
    players.forEach(gamePlayer => {
        const player = { ...gamePlayer };
        let bonus = 0;
        let fine = 0;
        let compensation = 0;

        player.shares.forEach((count, i) => {
            bonus += count * bonuses[i];
            fine += count * fines[i];
            compensation += count * compensations[i];
        });

        // console.log(player.name, ' Money: ', player.money);
        // console.log('compensation: ', compensation);
        player.money += bonus;
        if (player.name === name) player.money += compensation;
        else player.money -= fine;
        // console.log(player.name, ' money AFTER: ', player.money);

        if (player.money < 0) {
            player.money += fine;
            player.shares = [...gamePlayer.shares];
            const sortedFines = [...fines].sort((a, b) => b - a);
            for (fine of sortedFines) {
                if (!fine) continue;
                const index = fines.indexOf(fine);
                player.shares[index] = Math.floor(player.money / fine);
                player.money -= player.shares[index] * fine;
                // if (!player.money) break;
            }
        }

        updatedPlayers.push(player);
    });
    return updatedPlayers;
};
