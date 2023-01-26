class Card {
    constructor(color, isBoostCard, type, id) {
        this.color = color;
        this.isBoostCard = isBoostCard;
        this.type = type;
        this.id = id;
    }

    activate = (price, secondColor, thirdColor) => {
        const activePrice = [...price];
        const isBoostCard = this.isBoostCard;
        if (this.type === 'doubble') {
            activePrice[this.color] *= isBoostCard ? 2 : 0.5;
            activePrice[secondColor] *= isBoostCard ? 0.5 : 2;
        } else if (this.type === '100') {
            const { colorDown } = this.getColors();
            activePrice[this.color] += 100;
            activePrice[secondColor] -= 10;
            activePrice[thirdColor] -= 20;
            activePrice[
                colorDown.filter(
                    color => color !== secondColor && color !== thirdColor
                )
            ] -= 30;
        } else {
            const value = Number.parseInt(this.type);
            activePrice[this.color] += isBoostCard ? value : value - 90;
            activePrice[secondColor] += isBoostCard ? value - 90 : value;
        }
        return activePrice;
    };

    getColors = () => {
        let colorUp;
        let colorDown;
        if (this.isBoostCard) {
            colorUp = [this.color];
            colorDown = [0, 1, 2, 3].filter(idx => idx !== this.color);
        } else {
            colorUp = [0, 1, 2, 3].filter(idx => idx !== this.color);
            colorDown = [this.color];
        }

        return { colorUp, colorDown };
    };
}

export default Card;
