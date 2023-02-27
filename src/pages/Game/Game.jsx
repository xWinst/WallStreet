import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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

// import {
//     // setCurrentCard,
//     // setCurrentPrice,
//     // setFuturePrice,
//     // setStage,
//     // nextTurn,  //Нужон!!!
//     // updatePlayer,
//     // reset,
//     // setState,
// } from 'state/gameReducer';

import s from './Game.module.css';

const Game = () => {
    const { players, currentPlayerIdx, turn } = useSelector(
        state => state.game
    );
    const user = useSelector(state => state.user.name);
    const isPlayerMove = players[currentPlayerIdx].name === user;

    // const sliceGame = {
    //     turn,
    // };

    const [aiMove, setAiMove] = useState(false);

    // const dispatch = useDispatch();
    const navigate = useNavigate();

    // const cancel = () => {
    //     dispatch(setCurrentCard(null));
    //     dispatch(setFuturePrice([...price]));
    // };

    const ok = () => {
        // setError(false);
        setAiMove(false);
    };

    // const closeCard = () => {
    //     dispatch(
    //         setState({
    //             price: futurePrice,
    //             currentCard: null,
    //             stage: 'after',
    //         })
    //     );
    // };

    // const endTurn = e => {
    //     if (stage === 'before') {
    //         setError(true);
    //         return;
    //     }
    //     // player.shareMerger();
    //     setAiMove(true);
    //     // dispatch(nextTurn(game.nextTurn()));
    // };

    const exit = () => {
        navigate('/');
    };

    // console.log('RENDER GAME!!');

    return (
        <div className="container">
            <Icon icon="exit" onClick={exit} cn={s.icon} w={27} h={22} />
            <div className={s.info}>
                <Tablo />
                <div className={s.box}>
                    <p>
                        Ход № {turn}&nbsp;
                        <br />
                        <br /> Ходит:&nbsp;
                        <span className={s.player}>
                            {players[currentPlayerIdx].name}
                        </span>
                        {/* <br /> */}
                        {/* {stage === 'before' ? '1-й ' : '3-й '}этап */}
                    </p>
                    <ul className={s.box}>
                        {/* Инфо игроков: */}
                        {players.map((player, id) => (
                            <li key={player.name}>
                                <PlayerInfo playerId={id} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div>
                {isPlayerMove && <PlayerActions />}
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
