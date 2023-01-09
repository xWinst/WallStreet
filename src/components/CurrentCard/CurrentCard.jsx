import { Button, Card } from 'components';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import game from 'store';
import s from './CurrentCard.module.css';

const colors = ['blue', 'red', 'green', 'yellow'];
const player = game.players[0];

const CurrentCard = ({ cancel, closeCard }) => {
    const { shares } = player;
    const price = game.currentPrice;
    const card = game.currentCard;
    const { futurePrice, setFuturePrice } = game;

    const [secondColor, setSecondColor] = useState();
    const [thirdColor, setThirdColor] = useState();

    const [bonus, setBonus] = useState([0, 0, 0, 0]);
    const [fine, setFine] = useState([0, 0, 0, 0]);
    const [compensation, setCompensation] = useState([0, 0, 0, 0]);

    const { isBoostCard, color: mainColor } = card;
    const { colorUp, colorDown } = card.getColors();

    useEffect(() => {
        setThirdColor(colorDown[1]);
        if (isBoostCard) {
            setSecondColor(colorDown[0]);
            showCard(colorDown[0], colorDown[1]);
        } else {
            setSecondColor(colorUp[0]);
            showCard(colorUp[0], colorDown[1]);
        }
    }, [card]);

    const showCard = (secondColor, thirdColor) => {
        const activePrice = [...price];

        if (card.type === 'doubble') {
            activePrice[card.color] *= isBoostCard ? 2 : 0.5;
            activePrice[secondColor] *= isBoostCard ? 0.5 : 2;
        } else if (card.type === '100') {
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
        // console.table('activePrice: AFTER', activePrice);

        normalize(activePrice);
    };

    const chooseColor = color => {
        if (color === mainColor) return;
        setSecondColor(color);
        const thirdColor = colorDown.filter(idx => idx !== color)[0];
        setThirdColor(thirdColor);
        showCard(color, thirdColor);
    };

    const chooseThirdColor = color => {
        if (color === mainColor) return;
        setThirdColor(color);
        showCard(secondColor, color);
    };

    const normalize = activePrice => {
        // console.log('activePrice: ', ...activePrice);
        const finalPrice = [];
        const bonus = [0, 0, 0, 0];
        const fine = [0, 0, 0, 0];
        const compensation = [0, 0, 0, 0];
        for (let i = 0; i < activePrice.length; i++) {
            if (activePrice[i] < 10) {
                finalPrice[i] = 10;
                fine[i] = finalPrice[i] - activePrice[i];
            } else if (activePrice[i] > 250) {
                finalPrice[i] = 250;
                bonus[i] = activePrice[i] - finalPrice[i];
            } else finalPrice[i] = Math.floor(activePrice[i] / 10) * 10;

            if (shares[i] && price[i] > finalPrice[i])
                compensation[i] = price[i] - finalPrice[i];
        }

        setBonus(bonus);
        setFine(fine);
        setCompensation(compensation);
        setFuturePrice(finalPrice);

        return finalPrice;
    };

    const activateCard = () => {
        let total = 0;
        for (let i = 0; i < bonus.length; i++) {
            total += (bonus[i] + compensation[i]) * shares[i];
        }
        player.addMoney(total);
        closeCard();
    };

    const getLastColor = () => {
        return colorDown.filter(
            color => color !== secondColor && color !== thirdColor
        )[0];
    };

    // console.log('bonus: ', bonus);
    // console.log('fine: ', fine);
    // console.log('compensation: ', compensation);
    // console.log('mainColor: ', mainColor);
    // console.log('secondColor: ', secondColor);
    // console.log('fine[secondColor]: ', fine[secondColor]);
    // console.log('fine[mainColor]: ', fine[mainColor]);

    return (
        <div className={s.container}>
            <Card card={card} />
            <div className={s.info}>
                <div className={s.thumb}>
                    <span>Повышаем:</span>
                    <div className={s.box}>
                        <ul className={s.colorList}>
                            {colorUp.map(color => (
                                <li
                                    className={
                                        color === secondColor ||
                                        color === card.color
                                            ? s.active
                                            : s.color
                                    }
                                    style={{ backgroundColor: colors[color] }}
                                    key={color}
                                    onClick={() => chooseColor(color)}
                                />
                            ))}
                        </ul>
                        <span>
                            до:{' '}
                            {isBoostCard
                                ? futurePrice[mainColor]
                                : futurePrice[secondColor]}
                        </span>
                        {(bonus[mainColor] > 0 || bonus[secondColor] > 0) && (
                            <span className={s.bonus}>
                                (Бонус:{' '}
                                {isBoostCard
                                    ? `${bonus[mainColor]} x ${shares[mainColor]}`
                                    : `${bonus[secondColor]} x ${shares[secondColor]}`}
                                )
                            </span>
                        )}
                    </div>
                </div>
                <div className={s.thumb}>
                    <span>Понижаем:</span>
                    <div className={s.box}>
                        <ul className={s.colorList}>
                            {colorDown.map(color => (
                                <li
                                    className={
                                        color === secondColor ||
                                        color === card.color
                                            ? s.active
                                            : s.color
                                    }
                                    style={{ backgroundColor: colors[color] }}
                                    key={color}
                                    onClick={() => chooseColor(color)}
                                />
                            ))}
                        </ul>
                        <span>
                            до:{' '}
                            {isBoostCard
                                ? futurePrice[secondColor]
                                : futurePrice[mainColor]}
                        </span>
                        {(fine[mainColor] > 0 || fine[secondColor] > 0) && (
                            <span className={s.bonus}>
                                (Штраф:{' '}
                                {isBoostCard
                                    ? fine[secondColor]
                                    : fine[mainColor]}
                                )
                            </span>
                        )}
                        {(compensation[mainColor] > 0 ||
                            compensation[secondColor] > 0) && (
                            <span className={s.bonus}>
                                (Компенсация:{' '}
                                {isBoostCard
                                    ? `${compensation[secondColor]} x ${shares[secondColor]}`
                                    : `${compensation[mainColor]} x ${shares[mainColor]}`}
                                )
                            </span>
                        )}
                    </div>
                    {card.type === '100' && (
                        <>
                            <div className={s.box}>
                                <ul className={s.colorList}>
                                    {colorDown
                                        .filter(color => color !== secondColor)
                                        .map(color => (
                                            <li
                                                className={
                                                    color === thirdColor
                                                        ? s.active
                                                        : s.color
                                                }
                                                style={{
                                                    backgroundColor:
                                                        colors[color],
                                                }}
                                                key={color}
                                                onClick={() =>
                                                    chooseThirdColor(color)
                                                }
                                            />
                                        ))}
                                </ul>
                                <span>до: {futurePrice[thirdColor]}</span>
                                {fine[thirdColor] > 0 && (
                                    <span className={s.bonus}>
                                        (Штраф: {fine[thirdColor]})
                                    </span>
                                )}
                                {compensation[thirdColor] > 0 && (
                                    <span className={s.bonus}>
                                        (Компенсация:{' '}
                                        {`${compensation[thirdColor]} x ${shares[thirdColor]}`}{' '}
                                        )
                                    </span>
                                )}
                            </div>
                            <div className={s.box}>
                                <div
                                    className={s.active}
                                    style={{
                                        backgroundColor: colors[getLastColor()],
                                    }}
                                ></div>
                                <span>до: {futurePrice[getLastColor()]}</span>
                                {fine[getLastColor()] > 0 && (
                                    <span className={s.bonus}>
                                        (Штраф: {fine[getLastColor()]})
                                    </span>
                                )}

                                {compensation[getLastColor()] > 0 && (
                                    <span className={s.bonus}>
                                        (Компенсация:{' '}
                                        {`${compensation[getLastColor()]} x ${
                                            shares[getLastColor()]
                                        }`}
                                        )
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className={s.btns}>
                    <Button text="Принять" onClick={activateCard} />
                    <Button text="Отменить" onClick={cancel} />
                </div>
            </div>
        </div>
    );
};

export default observer(CurrentCard);
