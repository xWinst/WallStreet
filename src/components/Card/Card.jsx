import { getCardById, companyColors } from 'db';
import s from './Card.module.css';

const colors = companyColors;
// const bothDecks = game.bothDecks;

const getDownVolume = volume => {
    const number = Number.parseInt(volume);
    return 90 - number;
};

const Card = ({ cardId }) => {
    // const card = bothDecks.smallDeck[cardId] || bothDecks.bigDeck[cardId % 100];
    const card = getCardById(cardId);
    // console.log('bigDeck: ', bothDecks);
    const colorUp = card.isBoostCard ? colors[card.color] : 'white';
    const colorDown = card.isBoostCard ? 'white' : colors[card.color];

    return (
        <div
            className={
                card.type === 'doubble' || card.type === '100'
                    ? s.card
                    : s.smallCard
            }
        >
            <div className={s.up} style={{ background: colorUp }}>
                {card.type === 'doubble'
                    ? 'x2'
                    : card.type === '100'
                    ? '+100'
                    : `+${card.type}`}
            </div>
            <div
                className={card.type === '100' ? s.down100 : s.down}
                style={{ background: colorDown }}
            >
                {card.type === 'doubble' ? (
                    <span>&divide;2</span>
                ) : card.type === '100' ? (
                    '-10, -20, -30'
                ) : (
                    `-${getDownVolume(card.type)}`
                )}
            </div>
        </div>
    );
};

export default Card;
