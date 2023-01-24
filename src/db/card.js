class Card {
    constructor(color, isBoostCard, type, id) {
        this.color = color;
        this.isBoostCard = isBoostCard;
        this.type = type;
        this.id = id;
    }

    // get copy() {
    //     return {
    //         color: this.color,
    //         isBoostCard: this.isBoostCard,
    //         type: this.type,
    //         id: this.id,
    //     };
    // }

    activate = (price, secondColor, thirdColor) => {
        const activePrice = [...price];
        const isBoostCard = this.isBoostCard;
        if (this.type === 'doubble') {
            // price[0] = this.isBoostCard ? price[0] * 2 : price[0] / 2;
            // price[1] = this.isBoostCard ? price[1] / 2 : price[1] * 2;
            activePrice[this.color] *= isBoostCard ? 2 : 0.5;
            activePrice[secondColor] *= isBoostCard ? 0.5 : 2;
        } else if (this.type === '100') {
            // price[0] = price[0] + 100;
            // price[1] = price[1] - 10;
            // price[2] = price[2] - 20;
            // price[3] = price[3] - 30;
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
            // price[0] = this.isBoostCard
            //     ? price[0] + value
            //     : price[0] - 90 + value;
            // price[1] = this.isBoostCard
            //     ? price[1] - 90 + value
            //     : price[1] + value;
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
