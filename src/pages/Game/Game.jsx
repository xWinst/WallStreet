import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    CurrentCard,
    PlayerCards,
    PlayerInfo,
    Modal,
    PlayerActions,
    Button,
    Tablo,
    Icon,
} from 'components';

import {
    setCurrentCard,
    setCurrentPrice,
    setFuturePrice,
    setStage,
    nextTurn,
    updatePlayer,
    reset,
    setState,
} from 'state/gameReducer';

import { game } from 'model';
import s from './Game.module.css';

const Game = () => {
    const currentPrice = useSelector(state => state.game.currentPrice);
    const currentCard = useSelector(state => state.game.currentCard);
    const futurePrice = useSelector(state => state.game.futurePrice);
    const stage = useSelector(state => state.game.stage);
    const [error, setError] = useState(false);
    // const [aiMove, setAiMove] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const player = game.players[0];

    const saveGame = () => {
        game.currentPrice = currentPrice;
        localStorage.setItem('game', JSON.stringify(game));
    };

    const cancel = () => {
        dispatch(setCurrentCard(null));
        dispatch(setFuturePrice([...currentPrice]));
    };

    const ok = () => {
        setError(false);
    };

    const closeCard = () => {
        dispatch(
            setState({
                currentPrice: futurePrice,
                currentCard: null,
                stafe: game.nextStage(),
            })
        );

        dispatch(setCurrentPrice(futurePrice));
        dispatch(updatePlayer(player.removeCard(currentCard)));
        dispatch(setCurrentCard(null));
        dispatch(setStage('after'));
    };

    const endTurn = e => {
        if (stage === 'before') {
            setError(true);
            return;
        }
        player.shareMerger();

        dispatch(nextTurn(game.nextTurn()));
        saveGame();
    };

    const exit = () => {
        saveGame();
        game.reset();
        dispatch(reset());
        navigate('/');
    };

    return (
        player && (
            <div className={s.container}>
                <Icon icon="exit" onClick={exit} cn={s.icon} w={27} h={22} />
                <div className={s.info}>
                    <Tablo />
                    <div className={s.box}>
                        <PlayerInfo playerId={player.index} />
                        <PlayerActions />
                        <Button text="Конец хода" onClick={endTurn} />
                    </div>
                </div>
                <PlayerCards />
                {currentCard !== null && (
                    <Modal onClose={cancel} style={{ maxWidth: 400 }}>
                        <CurrentCard cancel={cancel} closeCard={closeCard} />
                    </Modal>
                )}

                {error && (
                    <Modal onClose={ok} style={{ maxWidth: 400 }}>
                        <div className={s.info}>
                            <p>Сначала нужно показать карточку</p>
                            <Button text="ok" onClick={ok} />
                        </div>
                    </Modal>
                )}

                {/* {aiMove && (
                    <Modal onClose={ok}>
                        <div className="box">
                            <PlayerInfo player={ai} />
                        </div>
                    </Modal>
                )} */}
            </div>
        )
    );
};

export default Game;
