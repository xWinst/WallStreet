import { useSelector } from 'react-redux';
import { game } from 'model';
import s from './PlayerInfo.module.css';

const PlayerInfo = ({ playerId }) => {
    // console.log('playerId: ', playerId);
    const price = useSelector(state => state.game.currentPrice);
    const turn = useSelector(state => state.game.turn);
    const gameState = useSelector(state => state.game.gameState);
    const player = useSelector(state => state.game.players[playerId]);
    const { shares } = game.players[playerId];

    return (
        <div className={s.info}>
            <p>Наличман: {player.money}</p>
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
                        <p
                            className={s.name}
                            style={{ color: game.companyColors[idx] }}
                        >
                            {game.companyNames[idx]}
                        </p>
                        <p className={s.count}>{shares[idx]}</p>
                        <p className={s.cost}>{price[idx] * shares[idx]}</p>
                    </li>
                ))}
            </ul>
            {/* <p className={s.capital}>
                Всего капиталу:
                <br />
                <span className={s.total}>
                    {shares.reduce(
                        (total, count, idx) => (total += count * price[idx]),
                        0
                    ) + player.money}{' '}
                    бабла
                </span>
            </p> */}

            <p style={{ textAlign: 'center' }}>
                Ходит&nbsp;
                <span className={s.player}>{player.name}</span>
                <br /> Ход № {turn},&nbsp;
                {gameState === 'before' ? '1-й этап' : '3-й этап'}
            </p>
        </div>
    );
};

export default PlayerInfo;
