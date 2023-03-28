// import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PlayersList, Icon, Button } from 'components';
import { exitGameRoom, startGame } from 'state/gameOperation';
import s from '../CreateGame/CreateGame.module.css';

const GameLobby = () => {
    // const id = useSelector(state => state.game.id);
    const user = useSelector(state => state.user.name);
    const rooms = useSelector(state => state.app.rooms);
    const { gameId } = useParams();

    const room = rooms.find(room => room._id === gameId);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (id) navigate('/game');
    // }, [id, navigate]);

    if (!room) return <Navigate to="/main/games" />;

    const { owner, numberBigCards, numberSmallCards } = room;
    const isOwner = user === owner;

    const exitGame = () => {
        exitGameRoom(gameId, isOwner);
        navigate('/main/games');
    };

    const start = () => {
        console.log('start!');
        startGame(gameId);
    };

    return (
        <div className={s.container}>
            <div className={s.goBack} onClick={() => navigate('/main/games')}>
                <Icon icon="arrow-left" w={20} />
                <p>На главную</p>
            </div>
            <h2 className={s.title}>Игроки</h2>
            <PlayersList room={room} />
            <h2 className={s.title}>Параметры игры</h2>
            <div className={s.params}>
                <p>Количество компаний</p>
                <p className={s.value}>4</p>
            </div>
            <div className={s.params}>
                <p>Количество "Широких" карт</p>
                <p className={s.value}>{numberBigCards}</p>
            </div>
            <div className={s.params}>
                <p>Количество "Узких" карт</p>
                <p className={s.value}>{numberSmallCards}</p>
            </div>
            <div className={s.params}>
                <Button
                    text={isOwner ? 'Удалить игру' : 'Покинуть игру'}
                    cn={s.btn}
                    click={exitGame}
                />
                {isOwner && <Button text="Начать" cn={s.btn} click={start} />}
            </div>
        </div>
    );
};

export default GameLobby;
