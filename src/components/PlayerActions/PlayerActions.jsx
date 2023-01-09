import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from 'components';
import game from 'store';
import s from './PlayerActions.module.css';

const companyNames = ['Cиние', 'Красные', 'Зеленые', 'Желтые'];
const colors = ['blue', 'red', 'green', 'yellow'];
const player = game.players[0];

const PlayerActions = () => {
    const price = game.currentPrice;
    const { money, shares, freeShares } = player;
    const [showBuy, setShowBuy] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [sales, setSales] = useState(['', '', '', '']);
    const [purchases, setPurchases] = useState(['', '', '', '']);
    const [reserve, setReserve] = useState(money);

    useEffect(() => {
        setReserve(
            money -
                purchases.reduce(
                    (total, count, idx) => total + count * price[idx],
                    0
                )
        );
    }, [purchases, money]);

    const openSell = () => {
        if (game.turn === 10) {
            setShowModal(true);
            return;
        }
        setShowSell(true);
        setShowBuy(false);
    };

    const openBuy = () => {
        if (game.turn === 10) {
            setShowModal(true);
            return;
        }
        setShowSell(false);
        setShowBuy(true);
    };

    const cancel = () => {
        setShowSell(false);
        setShowBuy(false);
        setSales(['', '', '', '']);
        setPurchases(['', '', '', '']);
        setReserve(money);
    };

    const submit = () => {
        player.addMoney(
            sales.reduce((total, count, idx) => total + count * price[idx], 0)
        );
        player.sellShares(sales);
        setShowSell(false);
        setSales(['', '', '', '']);
    };

    const submitBuy = () => {
        player.addMoney(
            purchases.reduce(
                (total, count, idx) => total - count * price[idx],
                0
            )
        );

        player.buyShares(purchases);

        setShowBuy(false);
        setPurchases(['', '', '', '']);
    };

    const onChangeSell = e => {
        const { name, value } = e.target;
        if (!Number(value) && value) return;
        let count = Number(value);
        const limit =
            game.gameState === 'before' ? shares[name] : freeShares[name];
        if (count > limit) count = limit;

        setSales(prev => {
            const result = [...prev];
            result[name] = count;
            return result;
        });
    };

    const getReserve = idx => {
        // console.log('idx: ', idx);
        const reservedPurchases = purchases.filter((_, i) => i !== Number(idx));
        // console.log('reservedPurchases: ', reservedPurchases);
        return (
            money -
            reservedPurchases.reduce(
                (total, count, idx) => total + count * price[idx],
                0
            )
        );
    };

    const onChangeBuy = e => {
        const { name, value } = e.target;
        if (!Number(value) && value) return;
        const reserve = getReserve(name);
        // console.log('reserve: ', reserve);

        let count = Number(value);
        if (count > Math.floor(reserve / price[name]))
            count = Math.floor(reserve / price[name]);
        if (count === 0) count = '';

        setPurchases(prev => {
            const result = [...prev];
            result[name] = count;
            return result;
        });
    };

    const ok = () => {
        setShowModal(false);
    };

    return (
        <div className={s.container}>
            <Button text="Продать" onClick={openSell} />
            <Button text="Купить" onClick={openBuy} />
            {showBuy && (
                <Modal onClose={cancel}>
                    <ul className={s.list}>
                        {companyNames.map((name, idx) => (
                            <li key={name} className={s.item}>
                                <p
                                    className={s.name}
                                    style={{ color: colors[idx] }}
                                >
                                    {companyNames[idx]}
                                </p>
                                <input
                                    className={s.count}
                                    name={idx}
                                    placeholder={`max ${Math.floor(
                                        reserve / price[idx]
                                    )}`}
                                    value={purchases[idx]}
                                    onChange={onChangeBuy}
                                />
                            </li>
                        ))}
                    </ul>
                    <div className={s.btns}>
                        <Button text="Принять" onClick={submitBuy} />
                        <Button text="Отменить" onClick={cancel} />
                    </div>
                </Modal>
            )}

            {showSell && (
                <Modal onClose={cancel}>
                    <ul className={s.list}>
                        {shares.map(
                            (count, idx) =>
                                count > 0 && (
                                    <li key={idx} className={s.item}>
                                        <p
                                            className={s.name}
                                            style={{ color: colors[idx] }}
                                        >
                                            {companyNames[idx]}
                                        </p>
                                        <input
                                            className={s.count}
                                            name={idx}
                                            placeholder={
                                                game.gameState === 'before'
                                                    ? `max  ${count}`
                                                    : `max  ${freeShares[idx]}`
                                            }
                                            value={sales[idx]}
                                            onChange={onChangeSell}
                                        />
                                        {sales[idx] && (
                                            <p className={s.money}>
                                                {sales[idx] * price[idx]} бабла
                                            </p>
                                        )}
                                    </li>
                                )
                        )}
                    </ul>
                    <p className={s.total}>
                        Всего:{' '}
                        {sales.reduce(
                            (total, count, idx) => total + count * price[idx],
                            0
                        )}{' '}
                        бабла
                    </p>
                    <div className={s.btns}>
                        <Button text="Принять" onClick={submit} />
                        <Button text="Отменить" onClick={cancel} />
                    </div>
                </Modal>
            )}

            {showModal && (
                <Modal onClose={ok}>
                    <div className="box">
                        <p>Операции с банком на последне ходу запрещены!</p>
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default observer(PlayerActions);
