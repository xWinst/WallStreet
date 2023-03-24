import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card } from 'components';
import { setFuturePrice, updatePlayer } from 'state/gameReducer';
import { getColors, companyColors, activateCard, getShares } from 'db';
import s from './ActiveCard.module.css';

const ActiveCard = ({ card, cancel }) => {
    const { isBoostCard, color: mainColor } = card;
    const { colorUp, colorDown } = getColors(card);

    const { price, futurePrice, players } = useSelector(state => state.game);

    const [secondColor, setSecondColor] = useState(
        isBoostCard ? colorDown[0] : colorUp[0]
    );
    const [thirdColor, setThirdColor] = useState(colorDown[1]);

    const [bonus, setBonus] = useState([0, 0, 0, 0]);
    const [fine, setFine] = useState([0, 0, 0, 0]);
    const [compensation, setCompensation] = useState([0, 0, 0, 0]);

    const colors = companyColors;
    const player = players[0];
    const shares = getShares(player);

    const dispatch = useDispatch();

    useEffect(() => {
        // console.log('Зачем???');
        showCard(secondColor, thirdColor);
    }, []);

    const showCard = (secondColor, thirdColor) => {
        // console.log('bingo!!!!??');
        const activePrice = activateCard(card, price, secondColor, thirdColor);
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
        // console.log('finalPrice: ', finalPrice);
        dispatch(setFuturePrice(finalPrice));
    };

    // if (!isReady) {
    //     setIsReady(true);
    //     showCard(secondColor, thirdColor);
    //     return;
    // }

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

    const applyCard = () => {
        let total = 0;
        for (let i = 0; i < bonus.length; i++) {
            total += (bonus[i] + compensation[i]) * shares[i];
        }
        // player.money += total;
        const { index, money } = player;

        dispatch(updatePlayer({ index, money: money + total }));
        // closeCard();
        // const resultTurn = {
        //     card,

        // }
    };

    const getLastColor = () => {
        return colorDown.filter(
            color => color !== secondColor && color !== thirdColor
        )[0];
    };

    const returnCard = () => {
        dispatch(setFuturePrice(price));
        cancel();
    };

    return (
        <div className={s.container}>
            <Card cardId={card.id} />
            <div className={s.info}>
                <div className={s.thumb}>
                    <span>Повышаем:</span>
                    <div className={s.box}>
                        <ul className={s.colorList}>
                            {colorUp.map(color => (
                                <li
                                    className={
                                        color === secondColor ||
                                        color === mainColor
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
                                        color === mainColor
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
                    <Button text="Принять" onClick={applyCard} />
                    <Button text="Отменить" onClick={returnCard} />
                </div>
            </div>
        </div>
    );
};

export default ActiveCard;