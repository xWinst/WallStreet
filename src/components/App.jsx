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
// import Player from 'state/Player';
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
    freeShares: [1, 1, 1, 1],
};
const ai = { name: 'Idiot', money: 0 };
//=======================================================================================

const App = () => {
    const currentPrice = useSelector(state => state.game.currentPrice);
    const currentCard = useSelector(state => state.game.currentCard);
    const futurePrice = useSelector(state => state.game.futurePrice);
    const gameState = useSelector(state => state.game.gameState);
    const player = useSelector(state => state.game.players[0]);

    // const [player, setIsReady] = useState(false);

    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    // const [aiMove, setAiMove] = useState(false);
    const { width } = useInner();

    useEffect(() => {
        if (!player) {
            // console.log('player: ', player1);
            dispatch(setPlayers([player1, ai]));
            // setIsReady(true);
        }
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
        // console.log('currentCard: ', currentCard);
        // removeCard(currentCard, player);

        // const { prop, value } = removeCard(currentCard.id, player);
        // dispatch(updatePlayer({ index: 0, prop, value }));
        dispatch(
            updatePlayer({
                index: 0,
                props: removeCard(currentCard.id, player),
            })
        );
        // player.removeCard(currentCard); /////////////////////
        dispatch(setCurrentCard(null));
        dispatch(setGameState('after'));
    };

    const endTurn = e => {
        if (gameState === 'before') {
            setError(true);
            return;
        }
        // player.shareMerger(); ////////////////////////

        dispatch(updatePlayer({ index: 0, props: shareMerger(player) }));

        // setAiMove(true);
        dispatch(nextTurn());
    };

    return (
        player && (
            <div className="container" style={{ height: window.innerHeight }}>
                <div className="info">
                    {width < 600 ? <Quotes /> : <Tablo />}
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
