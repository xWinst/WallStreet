import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserInfo, Icon, SharesList } from 'components';
// import { companyColors, companyNames } from 'db';
import s from './PlayerInfo.module.css';

const PlayerInfo = ({ player }) => {
    // console.log('player: ', player);
    // console.log('playerId: ', playerId);

    const price = useSelector(state => state.game.price);
    const [isExpanded, setIsExpanded] = useState();

    const shares = player.shares;

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    return (
        <li className={s.info}>
            <div className={s.btn} onClick={toggleExpand}>
                <UserInfo userName={player.name} userAvatar={player.avatar} />
                <Icon icon={isExpanded ? 'collaps' : 'expand'} w={20} />
            </div>
            {isExpanded && (
                <>
                    <div className={s.money}>
                        <Icon icon="money" w={30} />
                        <p>{player.money}</p>
                    </div>
                    <SharesList list={shares} price={price} full />
                    <div className={s.flexBox}>
                        <p>
                            Больших: <span>{player.numberBigCards}</span>
                        </p>
                        <p>
                            Малых: <span>{player.numberSmallCards}</span>
                        </p>
                    </div>
                </>
            )}
        </li>
    );
};

export default PlayerInfo;
