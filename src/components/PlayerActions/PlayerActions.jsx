import { useState, useRef } from 'react';
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
import { loadActiveGame } from 'state/gameOperation';
import s from './PlayerActions.module.css';

const PlayerActions = () => {
    const { price, turn, lastTurn, stage, player, id } = useSelector(
        state => state.game
    );
    const [error, setError] = useState(null);
    const [showBuy, setShowBuy] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [notice, setNotice] = useState(false);
    const [sales, setSales] = useState([0, 0, 0, 0]);
    const [purchases, setPurchases] = useState([0, 0, 0, 0]);
    const colors = companyColors;

    const dispatch = useDispatch();
    const shares = player.shares;

    const func = useRef();

    const submit = () => {
        func.current();
    };

    const sell = () => {
        console.log('sales: ', sales);
        console.log('price: ', price);

        dispatch(updatePlayer(sellShares(player, sales, price)));
        setShowSell(false);
        setSales([0, 0, 0, 0]);
    };

    const buy = () => {
        dispatch(updatePlayer(buyShares(player, purchases, price)));
        setShowBuy(false);
        setPurchases([0, 0, 0, 0]);
    };

    const openSell = () => {
        func.current = sell;
        if (turn === lastTurn) {
            setError('Операции с банком на последнем ходу запрещены!');
            return;
        }
        setShowSell(true);
        setShowBuy(false);
    };

    const openBuy = () => {
        func.current = buy;
        if (turn === lastTurn) {
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

    const onChangeSell = e => {
        const { name, value } = e.target;
        updateSales(name, value);
    };

    const updateSales = (name, value) => {
        setSales(prev => {
            const result = [...prev];
            result[name] = Number(value);
            console.log('result: ', result);
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
        setError(null);
        setNotice(null);
    };

    const getSalesMax = idx => {
        if (stage === 'before') return shares[idx];
        else return player.freeShares[idx];
    };

    const endTurn = e => {
        dispatch(updatePlayer(shareMerger(player)));
    };

    const finish = () => {
        if (stage === 'before') {
            setError('Сначала нужно показать карточку');
            return;
        }

        func.current = endTurn;
        setNotice('Вы уверены что хотите завершить ход?');
    };

    const loadGame = () => {
        loadActiveGame(id);
    };

    const reset = () => {
        func.current = loadGame;
        setNotice('Вы уверены что хотите сбросить ваши действия на этом ходу?');
    };

    return (
        <div className={s.container}>
            <div className={s.btnBox}>
                <Button text="Продать" click={openSell} st={{ width: 90 }} />
                <Button text="Купить" click={openBuy} st={{ width: 90 }} />
            </div>
            <div className={s.btnBox}>
                <Button text="Конец хода" click={finish} st={{ width: 120 }} />
                <Button text="Откатить ход" click={reset} st={{ width: 120 }} />
            </div>
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
                                    click={() => {
                                        updatePurchases(idx, 0);
                                    }}
                                    st={{ padding: 5, borderWidth: 1 }}
                                    // cn={s.btn}
                                />
                                <Button
                                    text="&ndash;"
                                    click={() => {
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
                                    click={() => {
                                        changePurchases(idx, 1);
                                    }}
                                    st={{ padding: '5px 6px', borderWidth: 1 }}
                                    // cn={s.btn}
                                />
                                <Button
                                    text={`Max = ${Math.floor(
                                        getReserve(idx) / price[idx]
                                    )}`}
                                    click={() => {
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
                        <Button text="Принять" click={submit} />
                        <Button text="Отменить" click={cancel} />
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
                                            click={() => updateSales(idx, 0)}
                                            cn={s.btn}
                                        />
                                        <Button
                                            text="-"
                                            click={() => changeSales(idx, -1)}
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
                                            click={() => changeSales(idx, 1)}
                                            cn={s.btn}
                                        />
                                        <Button
                                            text={`Max=${getSalesMax(idx)}`}
                                            click={() => {
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
                        <Button text="Принять" click={submit} />
                        <Button text="Отменить" click={cancel} />
                    </div>
                </Modal>
            )}

            {error && (
                <Modal onClose={ok} style={{ maxWidth: 400 }}>
                    <div className={s.error}>
                        <p>{error}</p>
                        <Button text="ok" click={ok} />
                    </div>
                </Modal>
            )}

            {notice && (
                <Modal onClose={ok} style={{ maxWidth: 400 }}>
                    <div className={s.error}>
                        <p>{notice}</p>
                        <div className={s.btns}>
                            <Button text="Принять" click={submit} />
                            <Button text="Отменить" click={ok} />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PlayerActions;
