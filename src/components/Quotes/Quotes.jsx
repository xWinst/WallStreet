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
    const price = useSelector(state => state.game.currentPrice);
    const futurePrice = useSelector(state => state.game.futurePrice);
    const getClass = (index, cost) => {
        if (price[index] === cost) return s.current;
        if (futurePrice[index] === cost) return s.future;
        return s.muted;
    };

    const getCloudColor = (idx, cost) => {
        if (
            futurePrice[idx] === 0 ||
            (cost > price[idx] && cost > futurePrice[idx]) ||
            (cost < price[idx] && cost < futurePrice[idx])
        ) {
            return '#aaaaaacc';
        }
        if (cost === price[idx] || cost === futurePrice[idx])
            return 'transparent';

        const range = futurePrice[idx] - price[idx];

        const alpha = Math.round(
            ((futurePrice[idx] - cost) * 204) / range
        ).toString(16);

        return '#aaaaaa' + alpha;
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
                                        '--clouding': getCloudColor(
                                            index,
                                            cost
                                        ),
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
