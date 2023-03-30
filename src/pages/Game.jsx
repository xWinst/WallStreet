import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
    PlayerCards,
    PlayerActions,
    Tablo,
    Icon,
    GameInfo,
    History,
} from 'components';
import { reset } from 'state/gameReducer';

const Game = () => {
    const { players, currentPlayer, player, turn, id } = useSelector(
        state => state.game
    );

    const dispatch = useDispatch();

    if (!id) return <Navigate to="/main/games" />;

    const exit = () => {
        dispatch(reset());
    };

    return (
        <div className="game">
            <Icon icon="exit" onClick={exit} cn="icon" w={27} h={22} />
            <div className="info">
                <Tablo />
                <div className="gameInfo">
                    <GameInfo game={{ players, currentPlayer, turn }} />
                    <History />
                </div>
            </div>
            {player.isTurn && <PlayerActions />}
            <PlayerCards />
        </div>
    );
};

export default Game;
