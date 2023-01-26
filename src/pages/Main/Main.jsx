import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPlayers, setState } from 'state/gameReducer';
import { Button } from 'components';
import { Player, game } from 'model';
import s from './Main.module.css';

const Main = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const lastGame = JSON.parse(localStorage.getItem('game'));
    // console.log('lastGame: ', lastGame);
    // console.log('game: ', game);

    const onChange = e => {
        setName(e.target.value);
    };

    const startGame = () => {
        Player.count = 0;
        const player = new Player(name || 'Anonymus', game.gameDecks);
        const ai = new Player('Idiot', game.gameDecks);
        game.players.push(player, ai);
        dispatch(setPlayers([player.copy, ai.copy]));

        navigate('/game');
    };

    const loadLastGame = () => {
        Player.count = 0;
        for (let i = 0; i < lastGame.players.length; i++) {
            const player = new Player();
            player.loadState(lastGame.players[i]);
            game.players.push(player);
        }
        const { turn, gameState, currentPrice } = lastGame;

        dispatch(
            setState({
                turn,
                gameState,
                currentPrice,
                players: game.players.map(player => player.copy),
            })
        );
        // dispatch(setPlayers(game.players.map(player => player.copy)));
        // dispatch(setCurrentPrice(lastGame.currentPrice));
        navigate('/game');
    };

    return (
        <div className={s.container}>
            <div className={s.box}>
                <p className={s.title}>Wall Street</p>
                {lastGame && (
                    <>
                        <p className={s.welcome}>
                            С возвращением{' '}
                            <span className={s.player}>
                                {lastGame.players[0].name}
                            </span>
                            !
                        </p>
                        <Button
                            onClick={loadLastGame}
                            text="Продолжить"
                            style={{
                                fontSize: '16px',
                                width: '150px',
                                height: '34px',
                            }}
                        />
                    </>
                )}
                <form className={s.form}>
                    <Button
                        onClick={startGame}
                        text="Начать новую"
                        style={{
                            fontSize: '16px',
                            width: '150px',
                            height: '34px',
                        }}
                    />
                    <p className={s.welcome}>как</p>
                    <input
                        className={s.name}
                        placeholder="Anonymus"
                        value={name}
                        onChange={onChange}
                    />
                </form>
            </div>
        </div>
    );
};

export default Main;
