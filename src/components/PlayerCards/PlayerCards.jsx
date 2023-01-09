import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Modal, Button } from 'components';
import cardDecks from 'db/cardDeck';
import s from './PlayerCards.module.css';
import game from 'store';

const bothDecks = new cardDecks();

const PlayerCards = () => {
    // console.log('Player Deck: ', cardDecks);
    // const item = useRef();
    const [error, setError] = useState(false);
    const { currentCard, setCurrentCard } = game;
    const player = game.players[0];

    const activeCard = idx => {
        // console.log('idx: ', idx);
        const card =
            idx > 99 ? bothDecks.bigDeck[idx % 100] : bothDecks.smallDeck[idx];
        setCurrentCard(card);
        return;
    };

    const chooseCard = e => {
        if (game.gameState === 'after') {
            setError(true);
            return;
        }
        const id = Number.parseInt(e.currentTarget.dataset.id);
        // item.current.className = 'cancelCard';
        // item.current = e.currentTarget;
        // e.currentTarget.className = 'selectedCard';
        activeCard(id);
        // setTimeout(() => activeCard(id), 500);
    };
    // console.log('player.bigDeck: ', player.bigDeck);
    // console.log('currentCard: ', currentCard);

    const ok = () => {
        setError(false);
    };

    return (
        <div className={s.decks}>
            <ul className={s.bigDeck}>
                {player.bigDeck
                    .filter(card => card !== currentCard?.id)
                    .map(id => (
                        <li key={id} onClick={chooseCard} data-id={id}>
                            <Card card={bothDecks.bigDeck[id % 100]} />
                        </li>
                    ))}
            </ul>
            <ul className={s.smallDeck}>
                {player.smallDeck
                    .filter(card => card !== currentCard?.id)
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

export default observer(PlayerCards);
