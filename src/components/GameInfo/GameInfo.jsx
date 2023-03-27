import { useSelector } from 'react-redux';
import { PlayerInfo } from 'components';
import s from './GameInfo.module.css';

const GameInfo = ({ game }) => {
    const user = useSelector(state => state.game.player);

    return (
        <div className={s.container}>
            <p>
                Ход № {game.turn}&nbsp;
                <br />
                <br /> Ходит:&nbsp;
                <span className={s.player}>{game.currentPlayer}</span>
            </p>
            <ul className={s.container}>
                {game.players.map(player => {
                    if (player.name === user?.name) player = user;
                    return <PlayerInfo player={player} key={player.name} />;
                })}
            </ul>
        </div>
    );
};

export default GameInfo;
