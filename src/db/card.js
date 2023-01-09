class Card {
    constructor(color, isBoostCard, type, id) {
        this.color = color;
        this.isBoostCard = isBoostCard;
        this.type = type;
        this.id = id;
    }

    // activate = price => {
    //     const result = [];
    //     if (this.type === 'doubble') {
    //         price[0] = this.isBoostCard ? price[0] * 2 : price[0] / 2;
    //         price[1] = this.isBoostCard ? price[1] / 2 : price[1] * 2;
    //     } else if (this.type === '100') {
    //         price[0] = price[0] + 100;
    //         price[1] = price[1] - 10;
    //         price[2] = price[2] - 20;
    //         price[3] = price[3] - 30;
    //     } else {
    //         const value = Number.parseInt(this.type);
    //         price[0] = this.isBoostCard
    //             ? price[0] + value
    //             : price[0] - 90 + value;
    //         price[1] = this.isBoostCard
    //             ? price[1] - 90 + value
    //             : price[1] + value;
    //     }
    //     return price;
    // };
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
