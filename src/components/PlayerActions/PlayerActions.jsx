import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Icon, Modal } from 'components';
import { updatePlayer } from 'state/gameReducer';
import {
    companyNames,
    companyColors,
    sellShares,
    buyShares,
    shareMerger,
} from 'db';

import s from './PlayerActions.module.css';

const PlayerActions = () => {
    const { price, turn, stage, player } = useSelector(state => state.game);
    const [error, setError] = useState(false);
    const [showBuy, setShowBuy] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [sales, setSales] = useState([0, 0, 0, 0]);
    const [purchases, setPurchases] = useState([0, 0, 0, 0]);
    const colors = companyColors;

    const dispatch = useDispatch();
    const shares = player.shares;

    const openSell = () => {
        if (turn === 10) {
            setError('Операции с банком на последнем ходу запрещены!');
            return;
        }
        setShowSell(true);
        setShowBuy(false);
    };

    const openBuy = () => {
        if (turn === 10) {
            setError('Операции с банком на последнем ходу запрещены!');
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
        dispatch(updatePlayer(sellShares(player, sales, price)));
        setShowSell(false);
        setSales([0, 0, 0, 0]);
    };

    const submitBuy = () => {
        dispatch(updatePlayer(buyShares(player, purchases, price)));
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

    const ok = () => {
        setError(false);
    };

    const getSalesMax = idx => {
        if (stage === 'before') return shares[idx];
        else return player.freeShares[idx];
    };

    const endTurn = e => {
        if (stage === 'before') {
            setError('Сначала нужно показать карточку');
            return;
        }

        dispatch(updatePlayer(shareMerger(player)));
    };

    return (
        <div className={s.container}>
            <Button text="Продать" onClick={openSell} st={{ width: 90 }} />
            <Button text="Купить" onClick={openBuy} st={{ width: 90 }} />
            <Button text="Конец хода" onClick={endTurn} st={{ width: 100 }} />
            {showBuy && (
                <Modal onClose={cancel}>
                    <ul className={s.list}>
                        <li className={s.title}>Покупка</li>
                        {companyNames.map((name, idx) => (
                            <li key={name} className={s.item}>
                                <Icon
                                    icon="share"
                                    w={26}
                                    s={{
                                        '--share-color': colors[idx],
                                        '--share-color2':
                                            idx === 1 || idx === 2
                                                ? colors[0]
                                                : colors[2],
                                    }}
                                />
                                <Button
                                    text="&lt;&lt;"
                                    onClick={() => {
                                        updatePurchases(idx, 0);
                                    }}
                                    st={{ padding: 5, borderWidth: 1 }}
                                    // cn={s.btn}
                                />
                                <Button
                                    text="&ndash;"
                                    onClick={() => {
                                        changePurchases(idx, -1);
                                    }}
                                    st={{ padding: 5, borderWidth: 1 }}
                                    // cn={s.btn}
                                />
                                <input
                                    className={s.count}
                                    type="range"
                                    name={idx}
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
                                    st={{ padding: '5px 6px', borderWidth: 1 }}
                                    // cn={s.btn}
                                />
                                <Button
                                    text={`Max = ${Math.floor(
                                        getReserve(idx) / price[idx]
                                    )}`}
                                    onClick={() => {
                                        updatePurchases(
                                            idx,
                                            Math.floor(
                                                getReserve(idx) / price[idx]
                                            )
                                        );
                                    }}
                                    st={{ padding: 5, borderWidth: 1 }}
                                    // cn={s.btnMax}
                                />
                                <p className={s.purchases}>
                                    {purchases[idx] > 0 && (
                                        <span>
                                            Покупаем {purchases[idx]} шт.
                                        </span>
                                    )}
                                </p>
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
                                        <Icon
                                            icon="share"
                                            w={26}
                                            s={{
                                                '--share-color': colors[idx],
                                                '--share-color2':
                                                    idx === 1 || idx === 2
                                                        ? colors[0]
                                                        : colors[2],
                                            }}
                                        />
                                        <Button
                                            text="0"
                                            onClick={() => {
                                                updateSales(idx, 0);
                                            }}
                                            cn={s.btn}
                                        />
                                        <Button
                                            text="-"
                                            onClick={() => {
                                                changeSales(idx, -1);
                                            }}
                                            cn={s.btn}
                                        />

                                        <input
                                            className={s.count}
                                            type="range"
                                            name={idx}
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
                                            cn={s.btn}
                                        />
                                        <Button
                                            text={`Max=${getSalesMax(idx)}`}
                                            onClick={() => {
                                                updateSales(
                                                    idx,
                                                    getSalesMax(idx)
                                                );
                                            }}
                                            cn={s.btnMax}
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
                    <div className={s.flexBox}>
                        <p className={s.total}>
                            <span>Всего: </span>
                            {sales.reduce(
                                (total, count, idx) =>
                                    total + count * price[idx],
                                0
                            )}
                        </p>
                        <Icon icon="money" w={20} />
                    </div>
                    <div className={s.btns}>
                        <Button text="Принять" onClick={submit} />
                        <Button text="Отменить" onClick={cancel} />
                    </div>
                </Modal>
            )}

            {error && (
                <Modal onClose={ok} style={{ maxWidth: 400 }}>
                    <div className={s.error}>
                        <p>{error}</p>
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PlayerActions;
