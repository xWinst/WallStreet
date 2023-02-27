import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Modal, Button, ActiveCard } from 'components';
// import { setCurrentCard } from 'state/gameReducer';
// import { CardDecks } from 'model';
import { getCardById } from 'db';
import s from './PlayerCards.module.css';

// const bothDecks = new CardDecks();

const PlayerCards = () => {
    const [error, setError] = useState(false);
    const [selectedCard, setSelectedCard] = useState();
    const player = useSelector(state => state.game.players[0]);
    const gameState = useSelector(state => state.game.gameState);

    // const dispatch = useDispatch();

    const activeCard = idx => {
        setSelectedCard(idx);
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

    const closeModal = () => {
        // alert('CLOSE!');
        setSelectedCard(null);
        setError(false);
    };

    return (
        <div className={s.decks}>
            <ul className={s.bigDeck}>
                {player.bigDeck
                    .filter(card => card !== selectedCard)
                    .map(id => (
                        <li key={id} onClick={chooseCard} data-id={id}>
                            <Card cardId={id} />
                        </li>
                    ))}
            </ul>
            <ul className={s.smallDeck}>
                {player.smallDeck
                    .filter(card => card !== selectedCard)
                    .map(id => (
                        <li key={id} onClick={chooseCard} data-id={id}>
                            <Card cardId={id} />
                        </li>
                    ))}
            </ul>

            {error && (
                <Modal onClose={closeModal}>
                    <div className="box">
                        <p>Сначала нужно закончить ход</p>
                        <Button text="ok" onClick={closeModal} />
                    </div>
                </Modal>
            )}

            {selectedCard && (
                <Modal onClose={closeModal}>
                    <ActiveCard
                        card={getCardById(selectedCard)}
                        cancel={closeModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default PlayerCards;
