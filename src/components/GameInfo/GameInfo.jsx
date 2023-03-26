import { PlayerInfo } from 'components';
import s from './GameInfo.module.css';

const GameInfo = ({ game }) => {
    return (
        <div className={s.container}>
            <p>
                Ход № {game.turn}&nbsp;
                <br />
                <br /> Ходит:&nbsp;
                <span className={s.player}>{game.currentPlayer}</span>
            </p>
            <ul className={s.container}>
                {game.players.map(player => (
                    <PlayerInfo player={player} key={player.name} />
                ))}
            </ul>
        </div>
    );
};

export default GameInfo;
