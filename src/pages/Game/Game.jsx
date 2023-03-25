import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import {
    // CurrentCard,
    PlayerCards,
    PlayerInfo,
    Modal,
    PlayerActions,
    Button,
    Tablo,
    Icon,
    // AiTurn,
} from 'components';

import s from './Game.module.css';

const Game = () => {
    const { players, currentPlayer, player, turn, id } = useSelector(
        state => state.game
    );

    const [aiMove, setAiMove] = useState(false);
    const navigate = useNavigate();

    if (!id) return <Navigate to="/main/newGame" />;

    // const dispatch = useDispatch();

    const ok = () => {
        setAiMove(false);
    };

    const exit = () => {
        navigate('/');
    };

    return (
        <div className="game">
            <Icon icon="exit" onClick={exit} cn={s.icon} w={27} h={22} />
            <div className={s.info}>
                <Tablo />
                <div className={s.box}>
                    <p>
                        Ход № {turn}&nbsp;
                        <br />
                        <br /> Ходит:&nbsp;
                        <span className={s.player}>{currentPlayer}</span>
                    </p>
                    <ul className={s.box}>
                        {players.map(player => (
                            <PlayerInfo player={player} key={player.name} />
                        ))}
                    </ul>
                </div>
            </div>
            <div>
                {player.isTurn && <PlayerActions />}
                <PlayerCards />
            </div>

            {/* {currentCard !== null && (
                    <Modal onClose={cancel} style={{ maxWidth: 400 }}>
                        <CurrentCard cancel={cancel} closeCard={closeCard} />
                    </Modal>
                )} */}

            {/* {error && (
                <Modal onClose={ok} style={{ maxWidth: 400 }}>
                    <div className={s.info}>
                        <p>Сначала нужно показать карточку</p>
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )} */}

            {aiMove && (
                <Modal onClose={ok}>
                    <div className="box">
                        {/* <AiTurn ai={game.players[1]} /> */}
                        <Button text="ok" onClick={ok} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Game;
