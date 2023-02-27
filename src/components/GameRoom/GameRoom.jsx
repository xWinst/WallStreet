import { useState } from 'react';
import { Icon, Button, UserInfo } from 'components';
import s from './GameRoom.module.css';
import { joinGameRoom } from 'state/gameOperation';

const GameRoom = ({ room }) => {
    // console.log('room: ', room);
    const [isExpanded, setIsExpanded] = useState();

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    const joinGame = gameId => {
        console.log('join GAME click', gameId);
        joinGameRoom(gameId);
    };

    return (
        <li className={s.item}>
            <div className={s.btn} onClick={toggleExpand}>
                <p className={s.gameName}>{room.owner} Game</p>
                <Icon icon={isExpanded ? 'collaps' : 'expand'} w={20} />
            </div>
            {isExpanded && (
                <>
                    <ul className={s.players}>
                        Игроки:
                        {room.players.map(({ name, avatar }) => (
                            <li key={name}>
                                <UserInfo userName={name} userAvatar={avatar} />
                            </li>
                        ))}
                    </ul>
                    <Button
                        text="Присоедениться"
                        onClick={() => joinGame(room._id)}
                    />
                </>
            )}
        </li>
    );
};

export default GameRoom;
