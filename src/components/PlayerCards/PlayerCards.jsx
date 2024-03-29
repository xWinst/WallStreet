import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Modal, Button, ActiveCard } from 'components';
// import { setCurrentCard } from 'state/gameReducer';
// import { CardDecks } from 'model';
import { getCardById } from 'db';
import s from './PlayerCards.module.css';

// const bothDecks = new CardDecks();

const PlayerCards = () => {
    const [error, setError] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const { player, stage } = useSelector(state => state.game);

    // const dispatch = useDispatch();

    // const activeCard = cardId => {
    //     setSelectedCard(cardId);
    // };

    const chooseCard = cardId => {
        console.log('cardId: ', cardId);
        if (!player.isTurn) return;
        if (stage === 'after') {
            setError('Вы уже показывали карту на этом ходу');
            return;
        }
        setSelectedCard(cardId);
    };

    const closeModal = () => {
        // alert('CLOSE!');
        setSelectedCard(null);
        setError(null);
    };

    return (
        <div className={s.decks}>
            <ul className={s.bigDeck}>
                {player.bigDeck
                    .filter(card => card !== selectedCard)
                    .map(id => (
                        <li key={id} onClick={() => chooseCard(id)}>
                            <Card card={getCardById(id)} />
                        </li>
                    ))}
            </ul>
            <ul className={s.smallDeck}>
                {player.smallDeck
                    .filter(card => card !== selectedCard)
                    .map(id => (
                        <li key={id} onClick={() => chooseCard(id)}>
                            <Card card={getCardById(id)} />
                        </li>
                    ))}
            </ul>

            {error && (
                <Modal onClose={closeModal}>
                    <div className={s.box}>
                        <p>{error}</p>
                        <Button text="ok" click={closeModal} />
                    </div>
                </Modal>
            )}

            {selectedCard !== null && (
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
