import { useSelector } from 'react-redux';
import { useInner } from 'hooks/useInner';
import { game } from 'model';
import s from './Tablo.module.css';

const getPricesArray = width => {
    const result = [];
    for (let i = 1; i <= 25; i++) result.push(i * 10);
    if (width < 768) result.reverse();
    return result;
};
const colors = game.companyColors;
// const bgColors = ['#4444aa', '#aa4444', '#448844', '#aaaa44'];
// const prices = getPrices();
const scale = (Math.PI * 1.5) / 2 / 240;

const getIndex = i => {
    if (i % 2) return 0;
    return 3;
};

const Tablo = () => {
    const price = useSelector(state => state.game.currentPrice);
    const futurePrice = useSelector(state => state.game.futurePrice);

    const { width } = useInner();
    const size = width / 2.5;
    const pricesArray = getPricesArray(width);

    const getStyle = (cost, index) => {
        const clouding = getCloudColor(index, cost);
        if (width < 768) return { '--clouding': clouding };

        const left = `${
            size +
            Math.cos(scale * (330 - cost)) * (size - (index * size) / 11.5)
        }px`;
        const top = `${
            size -
            Math.sin(scale * (330 - cost)) * (size - (index * size) / 11.5)
        }px`;

        return { left, top, '--clouding': clouding };
    };

    const getCloudColor = (idx, cost) => {
        const cloud = width < 768 ? '#aaaaaa' : '#777777';
        if (
            futurePrice[idx] === 0 ||
            (cost > price[idx] && cost > futurePrice[idx]) ||
            (cost < price[idx] && cost < futurePrice[idx])
        ) {
            return cloud + 'cc';
        }
        if (cost === price[idx] || cost === futurePrice[idx])
            return 'transparent';

        const range = futurePrice[idx] - price[idx];

        const alpha = Math.round(
            ((futurePrice[idx] - cost) * 204) / range
        ).toString(16);

        return cloud + alpha;
    };

    return (
        <ul className={s.tablo}>
            {colors.map((color, index) => (
                <li key={color}>
                    <ul className={s.info}>
                        {pricesArray.map(cost => (
                            <li
                                key={color + cost}
                                className={
                                    cost === price[index]
                                        ? s.activeCell
                                        : cost === futurePrice[index]
                                        ? s.future
                                        : s.cell
                                }
                                style={getStyle(cost, index)}
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
