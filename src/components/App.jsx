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
//=====================================================
import cardDecks from 'db/cardDeck';
import { removeCard, shareMerger } from 'helpers/playerUpdates';
// const colors = ['blue', 'red', 'green', 'yellow'];

const bothDecks = new cardDecks();

const dealCards = (typeDeck, count) => {
    const result = [];
    const deck = bothDecks[typeDeck];
    for (let i = 0; i < count; i++) {
        const rnd = Math.floor(Math.random() * deck.length);
        result.push(deck[rnd].id);
        deck.splice(rnd, 1);
    }

    return result;
};

// const player = new Player('Anonymus');
// const ai = new Player('Idiot');
const player1 = {
    name: 'Anonymus',
    money: 0,
    bigDeck: dealCards('bigDeck', 4),
    smallDeck: dealCards('smallDeck', 6),

    frezenShares: [0, 0, 0, 0],
    freeShares: [1, 1, 100, 100],
};
const ai = { name: 'Idiot', money: 0 };
//=======================================================================================

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
        if (!player) dispatch(setPlayers([player1, ai]));
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
        dispatch(
            updatePlayer({
                index: 0,
                props: removeCard(currentCard.id, player),
            })
        );
        dispatch(setCurrentCard(null));
        dispatch(setGameState('after'));
    };

    const endTurn = e => {
        if (gameState === 'before') {
            setError(true);
            return;
        }

        dispatch(updatePlayer({ index: 0, props: shareMerger(player) }));
        dispatch(nextTurn());
    };

    console.log(
        '1rem = ',
        getComputedStyle(document.documentElement, '').fontSize,
        'px'
    );
    console.log('1rem = ', document.documentElement.style, 'px');

    return (
        player && (
            <div className="container" style={{ height: window.innerHeight }}>
                <div className="info">
                    {width < 768 ? <Quotes /> : <Tablo />}
                    <div className="box">
                        <PlayerInfo player={player} />
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
