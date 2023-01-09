import { observer } from 'mobx-react-lite';
import game from 'store';
import s from './PlayerInfo.module.css';

const companyNames = ['Cиние', 'Красные', 'Зеленые', 'Желтые'];
const colors = ['blue', 'red', 'green', 'yellow'];

const PlayerInfo = () => {
    const price = game.currentPrice;
    const player = game.players[0];
    const { money, shares } = player;
    return (
        <div className={s.info}>
            <p>Наличман: {money}</p>
            <p>Акции:</p>
            <ul className={s.sharesList}>
                <li className={s.shares}>
                    <p className={s.name}>Компания</p>
                    <p className={s.count}>Кол-во</p>
                    <p className={s.cost} style={{ textAlign: 'center' }}>
                        Общая стоимость
                    </p>
                </li>
                {shares.map((count, idx) => (
                    <li key={idx} className={s.shares}>
                        <p className={s.name} style={{ color: colors[idx] }}>
                            {companyNames[idx]}
                        </p>
                        <p className={s.count}>{shares[idx]}</p>
                        <p className={s.cost}>{price[idx] * shares[idx]}</p>
                    </li>
                ))}
            </ul>
            <p className={s.capital}>
                Всего капиталу:
                <br />
                <span className={s.total}>
                    {shares.reduce(
                        (total, count, idx) => (total += count * price[idx]),
                        0
                    ) + money}{' '}
                    бабла
                </span>
            </p>

            <p style={{ textAlign: 'center' }}>
                Ход № {game.turn},&nbsp;
                {game.gameState === 'before' ? '1-й этап' : '3-й этап'}
            </p>
        </div>
    );
};

export default observer(PlayerInfo);
