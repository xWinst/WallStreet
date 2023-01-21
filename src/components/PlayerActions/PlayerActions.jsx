import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'components';
import { updatePlayer } from 'state/gameReducer';
import { sellShares, buyShares, getShares } from 'helpers/playerUpdates';
import s from './PlayerActions.module.css';

const companyNames = ['Cиние', 'Красные', 'Зеленые', 'Желтые'];
const colors = ['blue', 'red', 'green', 'yellow'];

const PlayerActions = () => {
    const price = useSelector(state => state.game.currentPrice);
    const player = useSelector(state => state.game.players[0]);
    const turn = useSelector(state => state.game.turn);
    const gameState = useSelector(state => state.game.gameState);
    const [showBuy, setShowBuy] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [sales, setSales] = useState([0, 0, 0, 0]);
    const [purchases, setPurchases] = useState([0, 0, 0, 0]);
    const [reserve, setReserve] = useState(player.money);

    const dispatch = useDispatch();

    const shares = getShares(player);

    // const [showState, setShowState] = useState(false);
    useEffect(() => {
        setReserve(
            player.money -
                purchases.reduce(
                    (total, count, idx) => total + count * price[idx],
                    0
                )
        );
    }, [purchases, player, price]);

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
        setReserve(player.money);
    };

    const submit = () => {
        dispatch(
            updatePlayer({
                index: 0,
                props: sellShares(sales, price, player),
            })
        );
        setShowSell(false);
        setSales([0, 0, 0, 0]);
    };

    const submitBuy = () => {
        dispatch(
            updatePlayer({
                index: 0,
                props: buyShares(purchases, price, player),
            })
        );
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
        console.log('max: ', max);
        let result = purchases[name] + value;
        if (result < 0) result = 0;
        if (result > max) result = max;
        updatePurchases(name, result);
    };

    const getReserve = idx => {
        // console.log('idx: ', idx);
        const reservedPurchases = purchases.filter((_, i) => i !== Number(idx));
        // console.log('reservedPurchases: ', reservedPurchases);
        return (
            player.money -
            reservedPurchases.reduce(
                (total, count, idx) => total + count * price[idx],
                0
            )
        );
    };

    const onChangeBuy = e => {
        const { name, value } = e.target;
        // console.log('e.target: ', e.target);
        if (!Number(value) && value) return;
        const reserve = getReserve(name);
        console.log('reserve: ', reserve);

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
        // setShowState(false);
    };

    const getSalesMax = idx => {
        if (gameState === 'before') return shares[idx];
        else return player.freeShares[idx];
    };

    // console.log('sales: ', sales);
    return (
        <div className={s.container}>
            <Button text="Продать" onClick={openSell} />
            <Button text="Купить" onClick={openBuy} />
            {showBuy && (
                <Modal onClose={cancel}>
                    <ul className={s.list}>
                        <li className={s.title}>Покупка</li>
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
                                    style={{ width: 30 }}
                                />
                                <Button
                                    text="-"
                                    onClick={() => {
                                        changePurchases(idx, -1);
                                    }}
                                    style={{ width: 25 }}
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
                                    style={{ width: 25 }}
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
                                    style={{ width: 30 }}
                                />
                                {purchases[idx] > 0 && (
                                    <span> Покупаем {purchases[idx]} шт.</span>
                                )}
                                <span>
                                    (Max:
                                    {Math.floor(getReserve(idx) / price[idx])})
                                </span>
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
                        <li className={s.title}>Продажа</li>
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
                                                &nbsp; (max:
                                                {getSalesMax(idx)})
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
                                                {sales[idx]} шт. х {price[idx]}$
                                                =&nbsp;
                                                {sales[idx] * price[idx]}
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
