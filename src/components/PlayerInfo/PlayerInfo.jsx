import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from 'components';
import { getShares, companyColors, companyNames } from 'db';
import s from './PlayerInfo.module.css';

const PlayerInfo = ({ playerId }) => {
    // console.log('playerId: ', playerId);
    const { price, players } = useSelector(state => state.game);
    const player = players[playerId];
    const [isExpanded, setIsExpanded] = useState();

    const shares = getShares(player);

    const toggleExpand = () => {
        setIsExpanded(state => !state);
    };

    return (
        <div className={s.info}>
            <div className={s.btn} onClick={toggleExpand}>
                <p className={s.player}>{player.name}</p>
                <Icon icon={isExpanded ? 'collaps' : 'expand'} w={20} />
            </div>
            {isExpanded && (
                <>
                    <div className={s.money}>
                        <Icon icon="money" w={30} />
                        <p>{player.money}</p>
                    </div>
                    <ul className={s.sharesList}>
                        <li className={s.shares}>
                            <p className={s.name}>Акции</p>
                            <p className={s.count}>Кол-во</p>
                            <p
                                className={s.cost}
                                style={{ textAlign: 'center' }}
                            >
                                Общая стоимость
                            </p>
                        </li>
                        {shares.map((count, idx) => (
                            <li key={idx} className={s.shares}>
                                <p
                                    className={s.name}
                                    style={{ color: companyColors[idx] }}
                                >
                                    {companyNames[idx]}
                                </p>
                                <p className={s.count}>{count}</p>
                                <p className={s.cost}>{price[idx] * count}</p>
                            </li>
                        ))}
                    </ul>
                    <div className={s.flexBox}>
                        <p>
                            Больших: <span>{player.bigDeck.length}</span>
                        </p>
                        <p>
                            Малых: <span>{player.smallDeck.length}</span>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default PlayerInfo;
