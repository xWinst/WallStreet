// import { useSelector } from 'react-redux';
import { SharesList, Card, Icon } from 'components';
import { getCardById, companyNames } from 'db';
import s from './Turn.module.css';

const Turn = ({ turn }) => {
    // const turn = useSelector(state => state.turn);

    const {
        currentTurn,
        player,
        stageBefore,
        stageAfter,
        card,
        bonuses,
        fines,
        compensations,
    } = turn;

    return (
        <div className={s.container}>
            <p className={s.topic}>
                Ход: {player}. № <span className={s.number}>{currentTurn}</span>
            </p>
            <p className={s.title}>На начало хода он имеет:</p>
            <div className={s.money}>
                <Icon icon="money" w={16} />
                <p>{stageBefore.money}</p>
            </div>
            {/* <p>Наличных денег: {stageBefore.money}</p> */}
            <p>Акции:</p>
            <SharesList
                list={stageBefore.startShares}
                price={stageBefore.price}
                full
            />
            <br />
            <p>Продает:</p>
            <SharesList list={stageBefore.sales} price={stageBefore.price} />
            <p>Покупает:</p>
            <SharesList
                list={stageBefore.purchases}
                price={stageBefore.price}
            />
            <br />
            <p className={s.title}>Показывает карту</p>
            <Card card={getCardById(card.id)} />
            <div className={s.flexBox}>
                <p>
                    Повышает {companyNames[card.colorUp]} акции до{' '}
                    {stageAfter.price[card.colorUp]}
                </p>
                {bonuses[card.colorUp] > 0 && (
                    <p className={s.bonus}>
                        Все игроки имеющие {`${companyNames[card.colorUp]}`}{' '}
                        акции получают бонус: {`${bonuses[card.colorUp]}`} за
                        каждую акцию.
                    </p>
                )}
            </div>

            <ul>
                {card.colorDown.map(color => (
                    <li className={s.flexBox} key={color}>
                        <p>
                            Понижает {companyNames[color]} до{' '}
                            {stageAfter.price[color]}
                        </p>
                        {compensations[color] > 0 && (
                            <p className={s.bonus}>
                                {player} получает компенсацию за понижение своих
                                акций: {`${compensations[color]}`} за каждую
                                акцию.
                            </p>
                        )}
                        {fines[color] > 0 && (
                            <p className={s.bonus}>
                                Все кроме {player} обязаны заплатить штраф:{' '}
                                {fines[color]} за каждую акцию. Акции за которые
                                не оплачен штраф изымаются.
                            </p>
                        )}
                    </li>
                ))}
            </ul>
            <br />
            <p className={s.title}>На последнем этапе {player}:</p>
            <p>Продает:</p>
            <SharesList list={stageAfter.sales} price={stageAfter.price} />
            <p>Покупает:</p>
            <SharesList list={stageAfter.purchases} price={stageAfter.price} />
        </div>
    );
};

export default Turn;
