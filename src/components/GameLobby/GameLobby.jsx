import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PlayersList, Icon, Button } from 'components';
import { exitGameRoom, joinRoom } from 'state/gameOperation';
import s from '../CreateGame/CreateGame.module.css';

const GameLobby = () => {
    // const { id: gameId } = useSelector(state => state.game);
    const user = useSelector(state => state.user.name);
    const rooms = useSelector(state => state.app.gameRooms);
    const { gameId } = useParams();

    // console.log('bingo!!');
    // console.log('gameId: ', gameId);
    const room = rooms.find(room => room._id === gameId);
    // console.log('room: ', room);

    const navigate = useNavigate();

    if (!room) return <Navigate to="/main/newGame" />;
    joinRoom(gameId);

    const { owner, numberBigCards, numberSmallCards } = room;
    const isOwner = user === owner;

    const exitGame = () => {
        exitGameRoom(gameId, isOwner);
        navigate('/main/newGame');
    };

    const startGame = () => {
        console.log('start!');
    };

    return (
        <div className={s.container}>
            <div className={s.goBack} onClick={() => navigate('/main/newGame')}>
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
                    onClick={exitGame}
                />
                {isOwner && (
                    <Button text="Начать" cn={s.btn} onClick={startGame} />
                )}
            </div>
        </div>
    );
};

export default GameLobby;
