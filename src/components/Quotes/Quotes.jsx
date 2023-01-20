// import { observer } from 'mobx-react-lite';
// import game from 'store';
import { useSelector } from 'react-redux';
import s from './Quotes.module.css';

const colors = ['blue', 'red', 'green', 'yellow'];

const getPrices = () => {
    const result = [];
    for (let i = 25; i > 0; i--) result.push(i * 10);
    return result;
};

const prices = getPrices();

const Quotes = () => {
    const currentPrice = useSelector(state => state.game.currentPrice);
    const futurePrice = useSelector(state => state.game.futurePrice);
    const getClass = (index, cost) => {
        if (currentPrice[index] === cost) return s.current;
        if (futurePrice[index] === cost) return s.future;
        return s.muted;
    };

    return (
        <ul className={s.tablo}>
            {colors.map((color, index) => (
                <li key={color}>
                    <ul className={s.range}>
                        {prices.map(cost => (
                            <li key={color + cost}>
                                <div
                                    className={getClass(index, cost)}
                                    style={{
                                        backgroundColor: color,
                                        color: index % 2 ? 'blue' : 'yellow',
                                    }}
                                >
                                    {cost}
                                </div>
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};

export default Quotes;
