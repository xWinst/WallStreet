import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Icon, Modal } from 'components';
import { synchronization, updatePlayer } from 'state/gameReducer';
import { loadActiveGame, nextTurn } from 'state/gameOperation';
import { setStageAfter } from 'state/turnReducer';
import { companyNames, companyColors, updateShares, getActions } from 'db';
import s from './PlayerActions.module.css';

const PlayerActions = () => {
    const { price, turn, lastTurn, stage, player, id } = useSelector(
        state => state.game
    );
    const prevShares = useSelector(state => state.turn.stageBefore.shares);
    const [error, setError] = useState(null);
    const [showBuy, setShowBuy] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [notice, setNotice] = useState(false);
    const [changes, setChanges] = useState([0, 0, 0, 0]);
    const colors = companyColors;

    const dispatch = useDispatch();
    const shares = player.shares;

    const func = useRef();

    const submit = () => {
        switch (func.current) {
            case 'buysell':
                changeShares();
                break;
            case 'endTurn':
                endTurn();
                break;
            case 'loadGame':
                loadGame();
                break;
            default:
                return;
        }
    };

    const changeShares = () => {
        dispatch(updatePlayer(updateShares(player, changes, price)));
        setShowBuy(false);
        setShowSell(false);
        setChanges([0, 0, 0, 0]);
    };

    const openModal = doSell => {
        func.current = 'buysell';
        if (turn === lastTurn) {
            setError('Операции с банком на последнем ходу запрещены!');
            return;
        }
        setShowSell(doSell);
        setShowBuy(!doSell);
    };

    const cancel = () => {
        setShowSell(false);
        setShowBuy(false);
        setChanges([0, 0, 0, 0]);
    };

    const updateChanges = (name, value) => {
        setChanges(prev => {
            const result = [...prev];
            result[name] = value;
            return result;
        });
    };

    const onChangeSell = e => {
        const { name, value } = e.target;
        updateChanges(name, -Number(value));
    };

    const onChangeBuy = e => {
        const { name, value } = e.target;
        updateChanges(name, Number(value));
    };

    const minChanges = (idx, value, k) => {
        const max = k > 0 ? maxBuy(idx) : maxSell(idx);
        let result = k * changes[idx] + value;
        if (result < 0) result = 0;
        if (result > max) result = max;
        updateChanges(idx, k * result);
    };

    const getReserve = idx => {
        const reservedPurchases = changes
            .map((count, i) => count * price[i])
            .filter((_, i) => i !== Number(idx));
        return (
            player.money -
            reservedPurchases.reduce((total, count, idx) => total + count, 0)
        );
    };

    const ok = () => {
        setError(null);
        setNotice(null);
    };

    const maxSell = idx => {
        if (stage === 'before') return shares[idx];
        else return shares[idx] - player.frezenShares[idx];
    };

    const maxBuy = idx => Math.floor(getReserve(idx) / price[idx]);

    const endTurn = e => {
        // dispatch(updatePlayer(shareMerger(player)));
        dispatch(setStageAfter({ ...getActions(prevShares, shares), price }));
        dispatch(synchronization());
        setNotice(null);
        nextTurn(id);
    };

    const finish = () => {
        if (stage === 'before') {
            setError('Сначала нужно показать карточку');
            return;
        }

        func.current = 'endTurn';
        setNotice('Вы уверены что хотите завершить ход?');
    };

    const loadGame = () => {
        loadActiveGame(id);
        setNotice(null);
    };

    const reset = () => {
        func.current = 'loadGame';
        setNotice('Вы уверены что хотите сбросить ваши действия на этом ходу?');
    };

    return (
        <div className={s.container}>
            <div className={s.btnBox} style={{ width: 90 }}>
                <Button text="Продать" click={() => openModal(true)} />
                <Button text="Купить" click={() => openModal(false)} />
            </div>
            <div className={s.btnBox} style={{ width: 120 }}>
                <Button text="Конец хода" click={finish} />
                <Button text="Откатить ход" click={reset} />
            </div>
            {showBuy && (
                <Modal onClose={cancel} st={{ minWidth: 340 }}>
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
                                    click={() => updateChanges(idx, 0)}
                                    st={{ padding: 5 }}
                                />
                                <Button
                                    text="&ndash;"
                                    click={() => minChanges(idx, -1, 1)}
                                    st={{ padding: 5 }}
                                />
                                <input
                                    className={s.count}
                                    type="range"
                                    name={idx}
                                    min="0"
                                    max={maxBuy(idx)}
                                    value={changes[idx]}
                                    onChange={onChangeBuy}
                                />

                                <Button
                                    text="+"
                                    click={() => minChanges(idx, 1, 1)}
                                    st={{ padding: '5px 6px' }}
                                />
                                <Button
                                    text={`Max = ${maxBuy(idx)}`}
                                    click={() =>
                                        updateChanges(idx, maxBuy(idx))
                                    }
                                    st={{ padding: 5 }}
                                />
                                <p className={s.purchases}>
                                    {changes[idx] > 0 && (
                                        <span>Покупаем {changes[idx]} шт.</span>
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
                <Modal onClose={cancel} st={{ minWidth: 340 }}>
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
                                            click={() => updateChanges(idx, 0)}
                                        />
                                        <Button
                                            text="-"
                                            click={() =>
                                                minChanges(idx, -1, -1)
                                            }
                                        />

                                        <input
                                            className={s.count}
                                            type="range"
                                            name={idx}
                                            min="0"
                                            max={maxSell(idx)}
                                            value={-changes[idx]}
                                            onChange={onChangeSell}
                                        />
                                        <Button
                                            text="+"
                                            click={() => minChanges(idx, 1, -1)}
                                        />
                                        <Button
                                            text={`Max=${maxSell(idx)}`}
                                            click={() =>
                                                updateChanges(
                                                    idx,
                                                    -maxSell(idx)
                                                )
                                            }
                                        />
                                        {changes[idx] < 0 && (
                                            <p className={s.money}>
                                                {-changes[idx]} х {price[idx]}{' '}
                                                =&nbsp;
                                                {-changes[idx] * price[idx]}
                                            </p>
                                        )}
                                    </li>
                                )
                        )}
                    </ul>
                    <div className={s.flexBox}>
                        <p className={s.total}>
                            <span>Всего: </span>
                            {changes.reduce(
                                (total, count, idx) =>
                                    total + -count * price[idx],
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
