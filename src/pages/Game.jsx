// import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
    PlayerCards,
    Modal,
    PlayerActions,
    // Button,
    Tablo,
    Icon,
    // AiTurn,
    GameInfo,
    History,
    Turn,
    Button,
} from 'components';
import { reset } from 'state/gameReducer';
import { setIsNew } from 'state/turnReducer';

const Game = () => {
    const { players, currentPlayer, player, turn, id } = useSelector(
        state => state.game
    );

    const isNew = useSelector(state => state.turn.isNew);

    // const [aiMove, setAiMove] = useState(false);
    const dispatch = useDispatch();

    if (!id) return <Navigate to="/main/games" />;

    const ok = () => {
        dispatch(setIsNew(false));
    };

    const exit = () => {
        dispatch(reset());
    };

    return (
        <div className="game">
            <Icon icon="exit" onClick={exit} cn="icon" w={27} h={22} />
            <div className="info">
                <Tablo />
                <div>
                    <GameInfo game={{ players, currentPlayer, turn }} />

                    <History />
                </div>
            </div>
            {player.isTurn && <PlayerActions />}
            <PlayerCards />

            {isNew && (
                <Modal onClose={ok}>
                    <Turn />
                    <Button text="OK" click={ok} />
                </Modal>
            )}
        </div>
    );
};

export default Game;
