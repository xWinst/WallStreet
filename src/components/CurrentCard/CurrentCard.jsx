import { Button, Card } from 'components';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFuturePrice, updatePlayer } from 'state/gameReducer';
import { game } from 'model';
import s from './CurrentCard.module.css';

const CurrentCard = ({ cancel, closeCard }) => {
    const price = useSelector(state => state.game.currentPrice);
    const cardId = useSelector(state => state.game.currentCard);
    const futurePrice = useSelector(state => state.game.futurePrice);

    const [secondColor, setSecondColor] = useState();
    const [thirdColor, setThirdColor] = useState();

    //useReducer!!!!!!
    const [bonus, setBonus] = useState([0, 0, 0, 0]);
    const [fine, setFine] = useState([0, 0, 0, 0]);
    const [compensation, setCompensation] = useState([0, 0, 0, 0]);

    const colors = game.companyColors;
    const player = game.players[0];
    const { shares } = player;
    const bothDecks = game.bothDecks;

    const dispatch = useDispatch();

    const card = bothDecks.smallDeck[cardId] || bothDecks.bigDeck[cardId % 100];

    const { isBoostCard, color: mainColor } = card;
    const { colorUp, colorDown } = card.getColors();

    useEffect(() => {
        // setThirdColor(colorDown[1]);
        // if (isBoostCard) {
        //     setSecondColor(colorDown[0]);
        //     showCard(colorDown[0], colorDown[1]);
        // } else {
        //     setSecondColor(colorUp[0]);
        //     showCard(colorUp[0], colorDown[1]);
        // }
    }, []);

    const showCard = (secondColor, thirdColor) => {
        console.log('bingo!!!!??');
        const activePrice = card.activate(price, secondColor, thirdColor);
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
        console.log('finalPrice: ', finalPrice);
        dispatch(setFuturePrice(finalPrice));
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

    const activateCard = () => {
        let total = 0;
        for (let i = 0; i < bonus.length; i++) {
            total += (bonus[i] + compensation[i]) * shares[i];
        }
        player.money += total;
        const { index, money } = player;

        dispatch(updatePlayer({ index, money }));
        closeCard();
    };

    const getLastColor = () => {
        return colorDown.filter(
            color => color !== secondColor && color !== thirdColor
        )[0];
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

export default CurrentCard;
