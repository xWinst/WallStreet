import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
    PlayerCards,
    Modal,
    PlayerActions,
    Button,
    Tablo,
    Icon,
    // AiTurn,
    GameInfo,
} from 'components';
import { reset } from 'state/gameReducer';

const Game = () => {
    const { players, currentPlayer, player, turn, id } = useSelector(
        state => state.game
    );

    const [aiMove, setAiMove] = useState(false);
    const dispatch = useDispatch();

    if (!id) return <Navigate to="/main/games" />;

    const ok = () => {
        setAiMove(false);
    };

    const exit = () => {
        dispatch(reset());
    };

    return (
        <div className="game">
            <Icon icon="exit" onClick={exit} cn="icon" w={27} h={22} />
            <div className="info">
                <Tablo />
                <GameInfo game={{ players, currentPlayer, turn }} />
            </div>
            <div>
                {player.isTurn && <PlayerActions />}
                <PlayerCards />
            </div>

            {aiMove && (
                <Modal onClose={ok}>
                    <div className="box">
                        {/* <AiTurn ai={game.players[1]} /> */}
                        <Button text="ok" click={ok} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Game;
