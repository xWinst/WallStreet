import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Modal, Turn, Button, UserInfo } from 'components';
import {
    setCurrentPrice,
    setFuturePrice,
    setResults,
    setShowTurn,
} from 'state/gameReducer';
import fire from 'images/firework.svg';
// import { setShowTurn } from 'state/turnReducer';
import s from './History.module.css';

const History = () => {
    const {
        showTurn,
        turns,
        id: gameId,
        currentPlayer,
        results,
    } = useSelector(state => state.game);
    const games = useSelector(state => state.app.games);
    // const { showTurn } = useSelector(state => state.turn);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);

    const dispatch = useDispatch();

    // const currentPrice = useRef();

    useEffect(() => {
        if (showTurn !== null) {
            const { stageBefore, stageAfter } = turns[showTurn];
            dispatch(setCurrentPrice(stageBefore.price));
            dispatch(setFuturePrice(stageAfter.price));
        }
    }, [showTurn, dispatch, turns]);

    useEffect(() => {
        if (currentPlayer === null) {
            dispatch(setResults());
            setShowGameOver(true);
        }
    }, [dispatch, currentPlayer]);

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    const changeTurn = index => {
        dispatch(setShowTurn(index));
    };

    const ok = () => {
        const game = games.find(({ id }) => id === gameId);
        dispatch(setShowTurn(null));
        dispatch(setCurrentPrice(game.price));
        dispatch(setFuturePrice(game.price));
        // currentPrice.current = null;
    };

    const close = () => {
        setShowGameOver(false);
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
                    {results && (
                        <li
                            className={s.item}
                            onClick={() => setShowGameOver(true)}
                        >
                            ИТОГИ ИГРЫ
                        </li>
                    )}
                </ul>
            )}
            {showTurn !== null && (
                <Modal onClose={ok}>
                    <Turn turn={turns[showTurn]} />
                    <Button text="OK" click={ok} cn={s.center} />
                </Modal>
            )}

            {showGameOver && (
                <Modal onClose={close} st={{ minWidth: 250 }}>
                    <p className={s.title}>ИГРА ОКОНЧЕНА</p>
                    <p className={s.dscr}>Победу одержал</p>
                    <div className={s.winner}>
                        <img src={fire} alt="fire" width="32" height="32" />
                        <UserInfo
                            userAvatar={results[0].avatar}
                            userName={results[0].name}
                        />
                        <img src={fire} alt="fire" width="32" height="32" />
                    </div>

                    <ul className={s.players}>
                        {results.map(({ avatar, name, capital }, i) => (
                            <li className={s.btn} key={name}>
                                <div className={s.money}>
                                    <p>{i + 1}.</p>
                                    <img src={avatar} alt="avatar" />
                                    <p>{name}</p>
                                </div>
                                <div className={s.money}>
                                    <p className={s.capital}>{capital}</p>
                                    <Icon icon="money" w={20} />
                                </div>
                            </li>
                        ))}
                    </ul>

                    <Button text="OK" click={close} cn={s.center} />
                </Modal>
            )}
        </div>
    );
};

export default History;
