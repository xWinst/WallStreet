import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Modal, Turn, Button } from 'components';
import { setCurrentPrice, setFuturePrice } from 'state/gameReducer';
import { setShowTurn } from 'state/turnReducer';
import s from './History.module.css';

const History = () => {
    const { price, turns } = useSelector(state => state.game);
    const { showTurn } = useSelector(state => state.turn);
    const [isExpanded, setIsExpanded] = useState(false);

    const dispatch = useDispatch();

    const currentPrice = useRef();

    useEffect(() => {
        if (showTurn !== null) {
            if (!currentPrice.current) currentPrice.current = price;
            const { stageBefore, stageAfter } = turns[showTurn];
            dispatch(setCurrentPrice(stageBefore.price));
            dispatch(setFuturePrice(stageAfter.price));
        }
    }, [showTurn, dispatch, price, turns]);

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    const changeTurn = index => {
        dispatch(setShowTurn(index));
    };

    const ok = () => {
        dispatch(setShowTurn(null));
        dispatch(setCurrentPrice(currentPrice.current));
        dispatch(setFuturePrice(currentPrice.current));
        currentPrice.current = null;
    };

    return (
        <div className={s.container}>
            <div className={s.btn} onClick={toggleExpand}>
                <p>&nbsp;История партии</p>
                <Icon icon={isExpanded ? 'collaps' : 'expand'} w={20} />
            </div>
            {isExpanded && (
                <ul className={s.list}>
                    {turns.map((turn, i) => (
                        <li
                            className={s.item}
                            key={turn.currentTurn + turn.player}
                            onClick={() => changeTurn(i)}
                        >
                            <p>{turn.player}.</p>
                            <p>
                                №{' '}
                                <span className={s.number}>
                                    {turn.currentTurn}
                                </span>
                            </p>
                        </li>
                    ))}
                </ul>
            )}
            {showTurn !== null && (
                <Modal onClose={ok}>
                    <Turn turn={turns[showTurn]} />
                    <Button text="OK" click={ok} />
                </Modal>
            )}
        </div>
    );
};

export default History;
