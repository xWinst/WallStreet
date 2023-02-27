import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePlayer, setFuturePrice } from 'state/gameReducer';
import { game } from 'model';
import s from './AiTurn.module.css';
import { Card, SharesList } from 'components';

const colorNames = game.companyNames;
const bothDecks = game.bothDecks;
// let x = 0;

const AiTurn = ({ ai }) => {
    const price = useSelector(state => state.game.currentPrice);
    const futurePrice = useSelector(state => state.game.futurePrice);
    const [result, setResult] = useState();
    const [bonus, setBonus] = useState([0, 0, 0, 0]);
    const [fine, setFine] = useState([0, 0, 0, 0]);
    const [compensation, setCompensation] = useState([0, 0, 0, 0]);

    const enemy = game.players[0];
    const ownCapital = ai.getTotal(price);
    const enemyCapital = enemy.getTotal(price);
    const dispatch = useDispatch();

    // const log = [];

    useEffect(() => {
        // setResult(cardsEvaluation());
        setResult('умное');
    }, []);

    const cardsEvaluation = () => {
        const aiDecks = [...ai.bigDeck, ...ai.smallDeck];
        const variants = aiDecks.map(cardId =>
            getCardActivationVariants(cardId)
        );

        const choosenCard = choiceCard(variants);
        // addLog(variants);

        return choosenCard;
    };

    cardsEvaluation(); ///////////////////////////////////

    const getCardActivationVariants = cardId => {
        const card =
            bothDecks.smallDeck[cardId] || bothDecks.bigDeck[cardId % 100];
        const { colorUp, colorDown } = card.getColors();
        const colorVariants = [];
        const priceVariants = [];
        if (card.isBoostCard) {
            colorDown.forEach(secondColor => {
                const thirdColors =
                    card.type === '100'
                        ? colorDown.filter(idx => idx !== secondColor)
                        : [];
                colorVariants.push([secondColor, thirdColors[0]]);
                priceVariants.push(
                    card.activate(price, secondColor, thirdColors[0])
                );
                if (card.type === '100') {
                    colorVariants.push([secondColor, thirdColors[1]]);
                    priceVariants.push(
                        card.activate(price, secondColor, thirdColors[1])
                    );
                }
            });
        } else {
            colorUp.forEach(secondColor => {
                colorVariants.push([secondColor]);
                priceVariants.push(card.activate(price, secondColor));
            });
        }
        return { card, colorVariants, priceVariants };
    };

    const choiceCard = variants => {
        // console.log('x', ++x);
        let maxRaiting = 0;
        let choosenCard = null;
        let choosenVariant = null;
        let futurePrice = null;
        const random = Math.random() * 0.3 + 0.7;
        variants.forEach(({ card, colorVariants, priceVariants }) => {
            const k2 =
                card.type === '100' || card.type === 'double' ? random : 1;
            colorVariants.forEach((variant, i) => {
                const enemyFutureCapital = enemy.getTotal(priceVariants[i]);
                const colorUp = card.isBoostCard ? card.color : variant[0];
                const k1 = 0.75; //coefficient //сколько денег вкладываем в акции
                const increasy =
                    k2 *
                    ((priceVariants[i][colorUp] / price[colorUp]) * k1 +
                        (1 - k1));
                const decreasy = enemyFutureCapital / enemyCapital;
                const raiting = increasy / decreasy;
                if (raiting > maxRaiting) {
                    maxRaiting = raiting;
                    choosenCard = card;
                    choosenVariant = variant;
                    // console.log('choosenVariant: ', choosenVariant);
                    futurePrice = priceVariants[i];

                    // colorUpIdx = colorUp;
                }
            });
        });
        const lastColor =
            choosenCard.type === '100'
                ? [0, 1, 2, 3].filter(
                      i =>
                          i !== choosenCard.color &&
                          i !== choosenVariant[0] &&
                          i !== choosenVariant[1]
                  )[0]
                : null;

        const result = {
            card: choosenCard,
            variant: choosenVariant,
            colorUp: choosenCard.isBoostCard
                ? choosenCard.color
                : choosenVariant[0],
            colorDown: [...choosenVariant, lastColor],
            futurePrice,
            startMoney: ai.money,
            startShares: [...ai.shares],
            startPrice: [...price],
        };

        console.log('ai.money: ', ai.money);
        console.log('startMoney: ', result.startMoney);

        const { sales, purchases } = actionBefore(result);
        console.log('sales: ', sales);
        result.sales = sales;
        result.purchases = purchases;

        showCard(result);
        const { salesAfter, purchasesAfter } = actionAfter(result);
        result.salesAfter = salesAfter;
        result.purchasesAfter = purchasesAfter;

        return result;
    };

    const actionBefore = ({ colorUp }) => {
        const sales = [...ai.shares];
        sales[colorUp] = 0;
        console.log('sales Before: ', sales);
        dispatch(updatePlayer(ai.sellShares(sales, price)));

        const purchases = [0, 0, 0, 0];
        const needShares = Math.floor((ownCapital * 0.75) / price[colorUp]);
        const sharesAvailable = ai.shares[colorUp];
        purchases[colorUp] = needShares - sharesAvailable;
        dispatch(updatePlayer(ai.buyShares(purchases, price)));
        return { sales, purchases };
    };

    const showCard = ({ futurePrice }) => {
        const finalPrice = [];
        const bonus = [0, 0, 0, 0];
        const fine = [0, 0, 0, 0];
        const compensation = [0, 0, 0, 0];
        for (let i = 0; i < futurePrice.length; i++) {
            if (futurePrice[i] < 10) {
                finalPrice[i] = 10;
                fine[i] = finalPrice[i] - futurePrice[i];
            } else if (futurePrice[i] > 250) {
                finalPrice[i] = 250;
                bonus[i] = futurePrice[i] - finalPrice[i];
            } else finalPrice[i] = Math.floor(futurePrice[i] / 10) * 10;

            if (ai.shares[i] && price[i] > finalPrice[i])
                compensation[i] = price[i] - finalPrice[i];
        }

        setBonus(bonus);
        setFine(fine);
        setCompensation(compensation);
        dispatch(setFuturePrice(finalPrice));
    };

    const actionAfter = ({ sales }) => {
        const salesAfter = [...ai.freeShares];
        console.log('salesAfter: ', salesAfter);
        dispatch(updatePlayer(ai.sellShares(salesAfter, futurePrice)));
        console.log('ai.money: ', ai.money);

        const purchasesAfter = salesAfter.map((count, i) => {
            console.log('count: ', count);
            console.log(
                'Math.floor(ai.money / 3 / futurePrice[i]: ',
                Math.floor(ai.money / 3 / futurePrice[i])
            );
            if (count === 0) return Math.floor(ai.money / 3 / futurePrice[i]);
            return 0;
        });
        console.log('purchasesAfter: ', purchasesAfter);
        dispatch(updatePlayer(ai.buyShares(purchasesAfter, futurePrice)));

        return { salesAfter, purchasesAfter };
    };

    // const {
    //     card,
    //     // variant,
    //     colorUp,
    //     colorDown,
    //     // futurePrice,
    //     startMoney,
    //     startShares,
    //     startPrice,
    //     sales,
    //     purchases,
    //     salesAfter,
    //     purchasesAfter,
    // } = result;
    // console.log('log: ', log);
    console.log('result: ', result);

    return (
        result && (
            <div className={s.container}>
                <p>Ходит АИ, на начало хода он имеет:</p>
                <p>Наличных денег: {result.startMoney}</p>
                {/* <p>Акции:</p> */}
                <SharesList
                    text="Акции:"
                    list={result.startShares}
                    price={result.startPrice}
                />
                <SharesList
                    text="Продает:"
                    list={result.sales}
                    price={result.startPrice}
                />
                <SharesList
                    text="Покупает:"
                    list={result.purchases}
                    price={result.startPrice}
                />
                <br />
                <p>
                    ===========================================================
                </p>
                <br />
                <p>Показывает карту</p>
                <Card cardId={result.card.id} />
                <div className={s.flexBox}>
                    <p>
                        Повышает {colorNames[result.colorUp]} до{' '}
                        {futurePrice[result.colorUp]}
                    </p>
                    {bonus[result.colorUp] > 0 && (
                        <p className={s.bonus}>
                            (Бонус:{' '}
                            {`${bonus[result.colorUp]} x ${
                                ai.shares[result.colorUp]
                            }`}
                            )
                        </p>
                    )}
                </div>
                <ul>
                    {result.colorDown.map(
                        color =>
                            color > 0 && (
                                <li className={s.flexBox} key={color}>
                                    <p>
                                        Понижает {colorNames[color]} до{' '}
                                        {result.futurePrice[color]}
                                    </p>
                                    {fine[color] > 0 && (
                                        <p className={s.bonus}>
                                            (Штраф: {fine[color]})
                                        </p>
                                    )}
                                    {compensation[color] > 0 && (
                                        <p className={s.bonus}>
                                            (Компенсация:{' '}
                                            {`${compensation[color]} x ${ai.shares[color]}`}
                                            )
                                        </p>
                                    )}
                                </li>
                            )
                    )}
                </ul>

                <br />
                <p>
                    ===========================================================
                </p>
                <br />
                <SharesList
                    text="Продает:"
                    list={result.salesAfter}
                    price={result.futurePrice}
                />
                <SharesList
                    text="Покупает:"
                    list={result.purchasesAfter}
                    price={result.futurePrice}
                />
            </div>
        )
        // <ul className={s.log}>
        //     {log.map((str, i) => (
        //         <li key={i}>{str}</li>
        //     ))}
        // </ul>
    );
};

export default AiTurn;
