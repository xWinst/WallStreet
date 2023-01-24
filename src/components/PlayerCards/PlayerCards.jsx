import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Modal, Button } from 'components';
import { setCurrentCard } from 'state/gameReducer';
import cardDecks from 'db/cardDeck';
import s from './PlayerCards.module.css';

const bothDecks = new cardDecks();

const PlayerCards = () => {
    const [error, setError] = useState(false);
    const currentCard = useSelector(state => state.game.currentCard);
    const player = useSelector(state => state.game.players[0]);
    const gameState = useSelector(state => state.game.gameState);

    const dispatch = useDispatch();

    const activeCard = idx => {
        dispatch(setCurrentCard(idx));
        return;
    };

    const chooseCard = e => {
        if (gameState === 'after') {
            setError(true);
            return;
        }
        const id = Number.parseInt(e.currentTarget.dataset.id);
        e.currentTarget.className = s.chosenCard;
        setTimeout(() => activeCard(id), 300);
    };

    const ok = () => setError(false);

    return (
        <div className={s.decks}>
            <ul className={s.bigDeck}>
                {player.bigDeck
                    .filter(card => card !== currentCard)
                    .map(id => (
                        <li key={id} onClick={chooseCard} data-id={id}>
                            <Card card={bothDecks.bigDeck[id % 100]} />
                        </li>
                    ))}
            </ul>
            <ul className={s.smallDeck}>
                {player.smallDeck
                    .filter(card => card !== currentCard)
                    .map(id => (
                        <li key={id} onClick={chooseCard} data-id={id}>
                            <Card card={bothDecks.smallDeck[id]} />
                        </li>
                    ))}
            </ul>

            {error && (
                <Modal onClose={ok}>
                    <div className="box">
                        <p>Сначала нужно закончить ход</p>
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PlayerCards;
