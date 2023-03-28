import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'components';

import s from './History.module.css';

const History = () => {
    const turns = useSelector(state => state.game.turns);
    const [isExpanded, setIsExpanded] = useState();

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    return (
        <div className={s.container}>
            <div className={s.btn} onClick={toggleExpand}>
                <p>&nbsp;История партии</p>
                <Icon icon={isExpanded ? 'collaps' : 'expand'} w={20} />
            </div>
            {isExpanded && (
                <ul>
                    {turns.map((turn, i) => (
                        <li key={turn.currentTurn + turn.player}>
                            Ход № {turn.currentTurn} Игрок: {turn.player}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default History;
