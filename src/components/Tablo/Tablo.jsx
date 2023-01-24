import { useSelector } from 'react-redux';
import { useInner } from 'hooks/useInner';
import s from './Tablo.module.css';

const getPrices = () => {
    const result = [];
    for (let i = 1; i <= 25; i++) result.push(i * 10);
    return result;
};
const colors = ['blue', 'red', 'green', 'yellow'];
// const bgColors = ['#4444aa', '#aa4444', '#448844', '#aaaa44'];
const prices = getPrices();

const getIndex = i => {
    if (i % 2) return 0;
    return 3;
};

// window.maximize()

const Tablo = () => {
    const price = useSelector(state => state.game.currentPrice);
    const futurePrice = useSelector(state => state.game.futurePrice);
    const { width } = useInner();
    const size = width / 2.5;
    // console.log('size: ', size);

    const getCloudColor = (idx, cost) => {
        if (
            futurePrice[idx] === 0 ||
            (cost > price[idx] && cost > futurePrice[idx]) ||
            (cost < price[idx] && cost < futurePrice[idx])
        ) {
            return '#777777cc';
        }
        if (cost === price[idx] || cost === futurePrice[idx])
            return 'transparent';

        const range = futurePrice[idx] - price[idx];

        const alpha = Math.round(
            ((futurePrice[idx] - cost) * 204) / range
        ).toString(16);
        // console.log('alf', ((futurePrice[idx] - cost + 10) * 169) / range);
        return '#777777' + alpha;
    };

    console.log('204', Number(204).toString(16));
    console.log('10', Number(10).toString(16));
    console.log('100', Number(100).toString(16));
    console.log('20', Number(20).toString(16));

    return (
        <ul className={s.tablo}>
            {colors.map((color, index) => (
                <li key={color}>
                    <ul className={s.info}>
                        {prices.map(cost => (
                            <li
                                key={cost}
                                className={
                                    cost === price[index]
                                        ? s.activeCell
                                        : cost === futurePrice[index]
                                        ? s.future
                                        : s.cell
                                }
                                style={{
                                    left: `${
                                        Math.cos(
                                            ((1.5 * Math.PI) / 2.0) *
                                                ((330 - cost) / 240)
                                        ) *
                                            (size - (index * size) / 11.5) +
                                        size
                                    }px`,
                                    top: `${
                                        size -
                                        Math.sin(
                                            ((1.5 * Math.PI) / 2.0) *
                                                ((330 - cost) / 240)
                                        ) *
                                            (size - (index * size) / 11.5)
                                    }px`,
                                    '--clouding': getCloudColor(index, cost),
                                    '--alpha': getCloudColor(index, cost),
                                }}
                            >
                                <div
                                    className={s.price}
                                    style={{
                                        background: `${color}`,
                                        color: `${colors[getIndex(index)]}`,
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

export default Tablo;
