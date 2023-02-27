import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GameSettings, Icon, PlayersList } from 'components';
// import { checkGameRoom, exitGameRoom } from 'state/gameOperation';
import s from './CreateGame.module.css';

const CreateGame = () => {
    const gameId = useSelector(state => state.game.id);

    const navigate = useNavigate();

    useEffect(() => {
        if (!gameId) {
            navigate('/main/newGame');
        }
    }, [gameId, navigate]);

    return (
        <div className={s.container}>
            <div className={s.btn} onClick={() => navigate('/main/newGame')}>
                <Icon icon="arrow-left" w={20} />
                <p className={s.text}>На главную</p>
            </div>
            <div className={s.box}>
                <div>
                    <h2 className={s.title}>Игроки</h2>
                    <PlayersList />
                </div>
                <div>
                    <h2 className={s.title}>Настроки</h2>
                    <GameSettings />
                </div>
            </div>
        </div>
    );
};

export default CreateGame;
