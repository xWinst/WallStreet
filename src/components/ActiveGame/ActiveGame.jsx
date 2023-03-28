import { useState } from 'react';
import { Icon, Button, GameInfo } from 'components';
import { loadActiveGame } from 'state/gameOperation';
import s from './ActiveGame.module.css';

const ActiveGame = ({ game }) => {
    const [isExpanded, setIsExpanded] = useState();

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    const loadGame = () => {
        loadActiveGame(game.id);
    };

    return (
        <li className={s.item}>
            <div className={s.btn} onClick={toggleExpand}>
                <div className={s.gameName}>
                    <p>
                        Game: <span>{game.name || game.id}</span>
                    </p>
                </div>
                <Icon icon={isExpanded ? 'collaps' : 'expand'} w={20} />
            </div>
            {isExpanded && (
                <>
                    <GameInfo game={game} />
                    <Button text="Продолжить" click={loadGame} />
                </>
            )}
        </li>
    );
};
export default ActiveGame;
