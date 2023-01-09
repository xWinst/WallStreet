import {
    Quotes,
    CurrentCard,
    PlayerCards,
    PlayerInfo,
    Modal,
    PlayerActions,
    Button,
} from 'components';

import { observer } from 'mobx-react-lite';
// import { injectStores } from '@mobx-devtools/tools';
import game from 'store';
import { useState } from 'react';

// injectStores({
//     game,
// });

const player = game.players[0];

const App = () => {
    const {
        currentPrice,
        setCurrentPrice,
        currentCard,
        setCurrentCard,
        futurePrice,
        setFuturePrice,
        setGameState,
    } = game;
    const [error, setError] = useState(false);

    const cancel = () => {
        setCurrentCard(null);
        setFuturePrice([...currentPrice]);
    };

    const ok = () => {
        setError(false);
    };

    const closeCard = () => {
        setCurrentPrice([...futurePrice]);
        player.removeCard(currentCard);
        setCurrentCard(null);
        setGameState('after');
    };

    const endTurn = e => {
        // console.log('e: ', e);
        if (game.gameState === 'before') {
            setError(true);
            return;
        }
        player.shareMerger();
        game.nextTurn();
        setGameState('before');
    };

    return (
        <div className="container" style={{ height: window.innerHeight }}>
            <div className="info">
                <Quotes />
                <div className="box">
                    <PlayerInfo />
                    <PlayerActions />
                    <Button text="Конец хода" onClick={endTurn} />
                </div>
            </div>
            <PlayerCards />
            {currentCard && (
                <Modal onClose={cancel}>
                    <CurrentCard cancel={cancel} closeCard={closeCard} />
                </Modal>
            )}

            {error && (
                <Modal onClose={ok}>
                    <div className="box">
                        <p>Сначала нужно показать карточку</p>
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default observer(App);
