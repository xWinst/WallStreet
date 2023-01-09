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

const size = window.innerHeight * 0.7;
const html = document.documentElement;
html.style.fontSize = size / 33 + 'px';

// window.maximize()

const Tablo = ({ price, futurePrice }) => {
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
                                            ((1.5 * Math.PI) / 2) *
                                                ((300 - cost) / 240)
                                        ) *
                                            (size - (index * size) / 11.5) +
                                        size
                                    }px`,
                                    top: `${
                                        size -
                                        Math.sin(
                                            ((1.5 * Math.PI) / 2) *
                                                ((300 - cost) / 240)
                                        ) *
                                            (size - (index * size) / 11.5) +
                                        20
                                    }px`,
                                    //   top: `${index * 50}px`,
                                }}
                            >
                                <div
                                    className={s.price}
                                    style={{
                                        // background:
                                        //   price === currentPrice[index]
                                        //     ? `${color}`
                                        //     : `${colors[index]}`,
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
