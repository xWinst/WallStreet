import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { Slider, Button, Icon } from 'components';
import { createGameRoom } from 'state/gameOperation';
import s from './CreateGame.module.css';

const CreateGame = () => {
    // const players = useSelector(state => state.game.players);
    // const [firstPlayer, setFirstPlayer] = useState(0);
    const [numberPlayers, setNumberPlayers] = useState(2);
    const [numberCompanies, setNumberCompanies] = useState(4);
    const [numberBigCards, setNumberBigCards] = useState(4);
    const [numberSmallCards, setNumberSmallCards] = useState(6);
    const [password, setPassword] = useState('');
    const [gameId, setGameId] = useState(false);

    const navigate = useNavigate();
    // const dispatch = useDispatch();

    useEffect(() => {
        if (gameId) navigate(`/game/${gameId}`);
    }, [gameId, navigate]);

    const create = () => {
        createGameRoom({
            numberPlayers,
            numberBigCards,
            numberSmallCards,
            password,
            setGameId,
        });
    };

    return (
        <div className={s.container}>
            <div className={s.goBack} onClick={() => navigate('/main/newGame')}>
                <Icon icon="arrow-left" w={20} />
                <p>На главную</p>
            </div>
            <h2 className={s.title}>Настроки</h2>
            <div className={s.settings}>
                <div className={s.prop}>
                    <p>Количество Игроков</p>
                    <div className={s.box}>
                        <p className={s.value}>{numberPlayers}</p>
                        <Slider
                            min={2}
                            max={4}
                            onChange={value => setNumberPlayers(value)}
                            defaultValue={numberPlayers}
                        />
                    </div>
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
                            max={Math.floor(20 / numberPlayers)}
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
                            max={Math.floor(32 / numberPlayers)}
                            onChange={value => setNumberSmallCards(value)}
                            defaultValue={numberSmallCards}
                        />
                    </div>
                </div>

                <div className={s.prop}>
                    <p>Установить пароль:</p>
                    <div className={s.box}>
                        <input
                            className={s.password}
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                </div>
                {/* <div className={s.prop}>
                        <p>Первым ходит игрок</p>
                        <Select
                            list={players.map(({ name }) => name)}
                            onSelect={value =>
                                setFirstPlayerIdx(
                                    players.findIndex(
                                        ({ name }) => name === value
                                    )
                                )
                            }
                            value={players[firstPlayerIdx]?.name}
                            name="playerTurn"
                        />
                    </div> */}

                <Button text="создать" cn={s.btn} onClick={create} />
                <p style={{ fontSize: '12px' }}>
                    P.S. На данный момент количество компаний вне зависимости от
                    выбора будет равно 4
                </p>
            </div>
        </div>
    );
};

export default CreateGame;
