import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card } from 'components';
import { setFuturePrice, updatePlayer, setState } from 'state/gameReducer';
import { setStageBefore, setCard, setBonuses } from 'state/turnReducer';
import { getColors, companyColors, activateCard, getActions } from 'db';
import s from './ActiveCard.module.css';

const ActiveCard = ({ card, cancel }) => {
    const { isBoostCard, color: mainColor } = card;
    const { colorUp, colorDown } = getColors(card);

    const { price, futurePrice, player, players } = useSelector(
        state => state.game
    );

    const [secondColor, setSecondColor] = useState(
        isBoostCard ? colorDown[0] : colorUp[0]
    );
    const [thirdColor, setThirdColor] = useState(colorDown[1]);

    const [bonus, setBonus] = useState([0, 0, 0, 0]);
    const [fine, setFine] = useState([0, 0, 0, 0]);
    const [compensation, setCompensation] = useState([0, 0, 0, 0]);

    const colors = companyColors;
    const shares = player.shares;

    const dispatch = useDispatch();

    useEffect(() => {
        // console.log('Зачем???');
        showCard(secondColor, thirdColor);
    }, []);

    const showCard = (secondColor, thirdColor) => {
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

    const applyCard = () => {
        let total = 0;
        for (let i = 0; i < bonus.length; i++) {
            total += (bonus[i] + compensation[i]) * shares[i];
        }

        const { money } = player;
        const deckType = card.id < 100 ? 'smallDeck' : 'bigDeck';
        const numberCards =
            card.id < 100 ? 'numberSmallCards' : 'numberBigCards';
        const deck = [...player[deckType]];

        deck.splice(deck.indexOf(card.id), 1);

        const prevPlayer = players.find(({ name }) => (name = player.name));
        const prevShares = prevPlayer.shares;
        const frezenShares = shares.map((number, i) => {
            let result = number - prevShares[i];
            if (result < 0) result = 0;
            return result;
        });

        dispatch(setStageBefore(getActions(prevShares, shares)));

        dispatch(
            setCard({
                id: card.id,
                colorUp: colorUp[0],
                colorDown: [secondColor, thirdColor],
            })
        );
        dispatch(setBonuses({ bonus, fine, compensation }));
        dispatch(
            updatePlayer({
                [deckType]: deck,
                [numberCards]: deck.length,
                money: money + total,
                frezenShares,
            })
        );
        dispatch(setState({ price: futurePrice, stage: 'after' }));
        cancel();
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
                    <Button text="Принять" click={applyCard} />
                    <Button text="Отменить" click={returnCard} />
                </div>
            </div>
        </div>
    );
};

export default ActiveCard;
