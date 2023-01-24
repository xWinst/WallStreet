import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Quotes,
    CurrentCard,
    PlayerCards,
    PlayerInfo,
    Modal,
    PlayerActions,
    Button,
    Tablo,
} from 'components';

import { useInner } from 'hooks/useInner';

import {
    setPlayers,
    setCurrentCard,
    setCurrentPrice,
    setFuturePrice,
    setGameState,
    nextTurn,
    updatePlayer,
} from 'state/gameReducer';

import Player from 'state/Player';

export const player1 = new Player('Anonymus');
export const ai = new Player('Idiot');

const App = () => {
    const currentPrice = useSelector(state => state.game.currentPrice);
    const currentCard = useSelector(state => state.game.currentCard);
    const futurePrice = useSelector(state => state.game.futurePrice);
    const gameState = useSelector(state => state.game.gameState);
    const player = useSelector(state => state.game.players[0]);

    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    // const [aiMove, setAiMove] = useState(false);
    const { width } = useInner();

    useEffect(() => {
        if (!player) dispatch(setPlayers([player1.copy, ai.copy]));
    }, [dispatch, player]);

    const cancel = () => {
        dispatch(setCurrentCard(null));
        dispatch(setFuturePrice([...currentPrice]));
    };

    const ok = () => {
        setError(false);
    };

    const closeCard = () => {
        dispatch(setCurrentPrice([...futurePrice]));
        dispatch(updatePlayer(player1.removeCard(currentCard)));
        dispatch(setCurrentCard(null));
        dispatch(setGameState('after'));
    };

    const endTurn = e => {
        if (gameState === 'before') {
            setError(true);
            return;
        }
        player1.shareMerger();
        dispatch(nextTurn());
    };

    return (
        player && (
            <div className="container">
                <div className="info">
                    {width < 768 ? <Quotes /> : <Tablo />}
                    <div className="box">
                        <PlayerInfo player={player1} />
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
                        <div className="box">
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

export default App;
