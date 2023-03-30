import { companyColors, companyNames } from 'db';
import s from './SharesList.module.css';

const SharesList = ({ list, price, full = false }) => {
    return (
        <ul className={s.sharesList}>
            <li className={s.shares}>
                <p className={s.name}>Акции</p>
                <p className={s.count}>Кол-во</p>
                <p className={s.cost} style={{ textAlign: 'center' }}>
                    Общая стоимость
                </p>
            </li>
            {list.map(
                (count, idx) =>
                    (full || count > 0) && (
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
                    )
            )}
        </ul>
    );
};

export default SharesList;
