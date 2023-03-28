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

export const getActions = (prevShares, shares, price) => {
    const sales = [0, 0, 0, 0];
    const purchases = [0, 0, 0, 0];
    for (let i = 0; i < shares.length; i++) {
        const result = shares[i] - prevShares[i];
        if (result > 0) purchases[i] = result;
        else sales[i] = -result;
    }

    return { sales, purchases, shares, price };
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
