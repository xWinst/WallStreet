import { game } from 'model';
import s from './SharesList.module.css';

const SharesList = ({ text, list, price }) => {
    return (
        <ul className={s.sharesList}>
            {text}
            {list.map(
                (count, idx) =>
                    count > 0 && (
                        <li className={s.flexBox} key={count + idx}>
                            <p
                                className={s.name}
                                style={{ color: game.companyColors[idx] }}
                            >
                                {game.companyNames[idx]}
                            </p>
                            <p className={s.count}>
                                {count} шт.&nbsp;&nbsp; х&nbsp;
                            </p>
                            <p className={s.cost}>{price[idx]}</p>
                        </li>
                    )
            )}
        </ul>
    );
};

export default SharesList;
