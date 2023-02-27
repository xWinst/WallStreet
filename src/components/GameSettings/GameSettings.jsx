import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Select, Slider, Button } from 'components';
import { setState } from 'state/gameReducer';
import { createGame } from 'db';
import s from './GameSettings.module.css';
import { findPlayers } from 'state/gameOperation';

// const getArray = (start, end) => {
//     const array = [];
//     for (let i = start; i <= end; i++) array.push(i);
//     return array;
// };

const GameSettings = () => {
    const players = useSelector(state => state.game.players);
    const [firstPlayerIdx, setFirstPlayerIdx] = useState(0);
    const [numberPlayers, setNumberPlayers] = useState(2);
    const [numberCompanies, setNumberCompanies] = useState(4);
    const [numberBigCards, setNumberBigCards] = useState(4);
    const [numberSmallCards, setNumberSmallCards] = useState(6);
    const [status, setStatus] = useState('creating');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const startGame = () => {
        dispatch(
            setState(
                createGame({
                    players,
                    firstPlayerIdx,
                    numberBigCards,
                    numberSmallCards,
                })
            )
        );
        navigate('/game');
    };

    const isReady = () => {
        return players.length === numberPlayers;
    };

    const changeStatus = () => {
        setStatus('waiting');
        findPlayers();
    };

    const changeNumberPlayers = value => {
        setNumberPlayers(value);
    };

    return (
        <div className={s.container}>
            <div className={s.prop}>
                <p>Количество Игроков</p>
                <div className={s.box}>
                    <p className={s.value}>{numberPlayers}</p>
                    <Slider
                        min={2}
                        max={4}
                        onChange={value => changeNumberPlayers(value)}
                        defaultValue={numberPlayers}
                    />
                </div>
            </div>
            <div className={s.prop}>
                <p>Первым ходит игрок</p>
                <Select
                    list={players.map(({ name }) => name)}
                    onSelect={value =>
                        setFirstPlayerIdx(
                            players.findIndex(({ name }) => name === value)
                        )
                    }
                    value={players[firstPlayerIdx]?.name}
                    name="playerTurn"
                />
            </div>
            <div className={s.prop}>
                <p>Количество компаний</p>
                <div className={s.box}>
                    <p className={s.value}>{numberCompanies}</p>
                    <Slider
                        min={3}
                        max={6}
                        onChange={value => setNumberCompanies(value)}
                        defaultValue={numberCompanies}
                    />
                </div>
            </div>
            <div className={s.prop}>
                <p>Количество "Широких" карт</p>
                <div className={s.box}>
                    <p className={s.value}>{numberBigCards}</p>
                    <Slider
                        min={0}
                        max={Math.floor(20 / players.length)}
                        onChange={value => setNumberBigCards(value)}
                        defaultValue={numberBigCards}
                    />
                </div>
            </div>
            <div className={s.prop}>
                <p>Количество "Узких" карт</p>
                <div className={s.box}>
                    <p className={s.value}>{numberSmallCards}</p>
                    <Slider
                        min={0}
                        max={Math.floor(32 / players.length)}
                        onChange={value => setNumberSmallCards(value)}
                        defaultValue={numberSmallCards}
                    />
                </div>
            </div>
            <div className={s.btnBox}>
                <Button text="удалить комнату" />
                {status === 'creating' && (
                    <Button
                        text="нaйти игроков"
                        cn={s.btnStart}
                        onClick={changeStatus}
                    />
                )}
                {status === 'waiting' && (
                    <Button
                        text="начать игру"
                        disabled={isReady}
                        cn={s.btnStart}
                        onClick={startGame}
                    />
                )}
            </div>
        </div>
    );
};

export default GameSettings;
