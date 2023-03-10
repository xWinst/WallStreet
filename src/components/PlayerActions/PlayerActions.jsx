import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'components';
import { updatePlayer } from 'state/gameReducer';
import { game } from 'model';
import s from './PlayerActions.module.css';

const PlayerActions = () => {
    const companyNames = game.companyNames;
    const colors = game.companyColors;

    const price = useSelector(state => state.game.currentPrice);
    const turn = useSelector(state => state.game.turn);
    const gameState = useSelector(state => state.game.gameState);
    const [showBuy, setShowBuy] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [sales, setSales] = useState([0, 0, 0, 0]);
    const [purchases, setPurchases] = useState([0, 0, 0, 0]);

    const dispatch = useDispatch();
    const player = game.players[0];
    const { shares } = player;

    const openSell = () => {
        if (turn === 10) {
            setShowModal(true);
            return;
        }
        setShowSell(true);
        setShowBuy(false);
    };

    const openBuy = () => {
        if (turn === 10) {
            setShowModal(true);
            return;
        }
        setShowSell(false);
        setShowBuy(true);
    };

    const cancel = () => {
        setShowSell(false);
        setShowBuy(false);
        setSales([0, 0, 0, 0]);
        setPurchases([0, 0, 0, 0]);
    };

    const submit = () => {
        dispatch(updatePlayer(player.sellShares(sales, price)));
        setShowSell(false);
        setSales([0, 0, 0, 0]);
    };

    const submitBuy = () => {
        dispatch(updatePlayer(player.buyShares(purchases, price)));
        setShowBuy(false);
        setPurchases([0, 0, 0, 0]);
    };

    const onChangeSell = e => {
        const { name, value } = e.target;
        updateSales(name, value);
    };

    const updateSales = (name, value) => {
        setSales(prev => {
            const result = [...prev];
            result[name] = Number(value);
            return result;
        });
    };

    const updatePurchases = (name, value) => {
        setPurchases(prev => {
            const result = [...prev];
            result[name] = Number(value);
            return result;
        });
    };

    const changeSales = (name, value) => {
        let result = sales[name] + value;
        if (result < 0) result = 0;
        if (result > getSalesMax(name)) result = getSalesMax(name);
        updateSales(name, result);
    };

    const changePurchases = (name, value) => {
        const max = Math.floor(getReserve(name) / price[name]);
        let result = purchases[name] + value;
        if (result < 0) result = 0;
        if (result > max) result = max;
        updatePurchases(name, result);
    };

    const getReserve = idx => {
        const reservedPurchases = purchases
            .map((count, i) => count * price[i])
            .filter((_, i) => i !== Number(idx));
        return (
            player.money -
            reservedPurchases.reduce((total, count, idx) => total + count, 0)
        );
    };

    const onChangeBuy = e => {
        const { name, value } = e.target;
        updatePurchases(name, value);
    };

    const ok = () => setShowModal(false);

    const getSalesMax = idx => {
        if (gameState === 'before') return shares[idx];
        else return player.freeShares[idx];
    };

    return (
        <div className={s.container}>
            <Button text="??????????????" onClick={openSell} />
            <Button text="????????????" onClick={openBuy} />
            {showBuy && (
                <Modal onClose={cancel}>
                    <ul className={s.list}>
                        <li className={s.title}>??????????????</li>
                        {companyNames.map((name, idx) => (
                            <li key={name} className={s.item}>
                                <p
                                    className={s.name}
                                    style={{ color: colors[idx] }}
                                >
                                    {companyNames[idx]}
                                </p>
                                <Button
                                    text="Min"
                                    onClick={() => {
                                        updatePurchases(idx, 0);
                                    }}
                                    style={{ width: '3rem' }}
                                />
                                <Button
                                    text="-"
                                    onClick={() => {
                                        changePurchases(idx, -1);
                                    }}
                                    style={{ width: '2.5rem' }}
                                />
                                <input
                                    className={s.count}
                                    name={idx}
                                    type="range"
                                    min="0"
                                    max={`${Math.floor(
                                        getReserve(idx) / price[idx]
                                    )}`}
                                    value={purchases[idx]}
                                    onChange={onChangeBuy}
                                />
                                <Button
                                    text="+"
                                    onClick={() => {
                                        changePurchases(idx, 1);
                                    }}
                                    style={{ width: '2.5rem' }}
                                />
                                <Button
                                    text="Max"
                                    onClick={() => {
                                        updatePurchases(
                                            idx,
                                            Math.floor(
                                                getReserve(idx) / price[idx]
                                            )
                                        );
                                    }}
                                    style={{ width: '3rem' }}
                                />
                                <p className={s.purchases}>
                                    {purchases[idx] > 0 && (
                                        <span>
                                            ???????????????? {purchases[idx]} ????.
                                        </span>
                                    )}
                                    <span>
                                        (Max:
                                        {Math.floor(
                                            getReserve(idx) / price[idx]
                                        )}
                                        )
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className={s.btns}>
                        <Button text="??????????????" onClick={submitBuy} />
                        <Button text="????????????????" onClick={cancel} />
                    </div>
                </Modal>
            )}

            {showSell && (
                <Modal onClose={cancel}>
                    <ul className={s.list}>
                        <li className={s.title}>??????????????</li>
                        {shares.map(
                            (count, idx) =>
                                count > 0 && (
                                    <li key={idx} className={s.item}>
                                        <p
                                            className={s.name}
                                            style={{ color: colors[idx] }}
                                        >
                                            {companyNames[idx]}
                                            <span className={s.stock}>
                                                ({getSalesMax(idx)} ????.)
                                            </span>
                                        </p>
                                        <Button
                                            text="Min"
                                            onClick={() => {
                                                updateSales(idx, 0);
                                            }}
                                            style={{ width: '3rem' }}
                                        />
                                        <Button
                                            text="-"
                                            onClick={() => {
                                                changeSales(idx, -1);
                                            }}
                                            style={{ width: '2.5rem' }}
                                        />

                                        <input
                                            className={s.count}
                                            name={idx}
                                            type="range"
                                            min="0"
                                            max={getSalesMax(idx)}
                                            value={sales[idx]}
                                            onChange={onChangeSell}
                                        />
                                        <Button
                                            text="+"
                                            onClick={() => {
                                                changeSales(idx, 1);
                                            }}
                                            style={{ width: '2.5rem' }}
                                        />
                                        <Button
                                            text="Max"
                                            onClick={() => {
                                                updateSales(
                                                    idx,
                                                    getSalesMax(idx)
                                                );
                                            }}
                                            style={{ width: '3rem' }}
                                        />
                                        {sales[idx] > 0 && (
                                            <p className={s.money}>
                                                {sales[idx]} ????. ?? {price[idx]}$
                                                =&nbsp;
                                                {sales[idx] * price[idx]}
                                            </p>
                                        )}
                                    </li>
                                )
                        )}
                    </ul>
                    <p className={s.total}>
                        ??????????:{' '}
                        {sales.reduce(
                            (total, count, idx) => total + count * price[idx],
                            0
                        )}{' '}
                        ??????????
                    </p>
                    <div className={s.btns}>
                        <Button text="??????????????" onClick={submit} />
                        <Button text="????????????????" onClick={cancel} />
                    </div>
                </Modal>
            )}

            {showModal && (
                <Modal onClose={ok}>
                    <div className="box">
                        <p>???????????????? ?? ???????????? ???? ?????????????????? ???????? ??????????????????!</p>
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )}

            {/* {showState && (
                <Modal onClose={ok}>
                    <div className="box">
                        <p>{player.money}</p>
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )} */}
        </div>
    );
};

export default PlayerActions;
