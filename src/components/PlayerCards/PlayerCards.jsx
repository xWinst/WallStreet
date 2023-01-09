import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Modal, Button } from 'components';
import cardDeck from 'db/cardDeck';
// import Player from 'store/player';
import s from './PlayerCards.module.css';

import game from 'store';

const PlayerCards = () => {
    // const item = useRef();
    const [error, setError] = useState(false);
    const { currentCard, setCurrentCard } = game;
    const player = game.players[0];

    const activeCard = idx => {
        // console.log('idx: ', idx);
        const card =
            idx > 99 ? cardDeck.bigDeck[idx % 100] : cardDeck.smallDeck[idx];
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
                            <Card card={cardDeck.bigDeck[id % 100]} />
                        </li>
                    ))}
            </ul>
            <ul className={s.smallDeck}>
                {player.smallDeck
                    .filter(card => card !== currentCard?.id)
                    .map(id => (
                        <li key={id} onClick={chooseCard} data-id={id}>
                            <Card card={cardDeck.smallDeck[id]} />
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
