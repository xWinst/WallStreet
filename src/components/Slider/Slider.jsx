import { useState, useEffect } from 'react';
import s from './Slider.module.css';

const Slider = ({ min, max, defaultValue, onChange, st = {} }) => {
    // console.log('defaultValue: ', defaultValue);
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (value > max) {
            setValue(max);
            onChange(max);
        }
    }, [max, value, onChange]);

    const handleChange = e => {
        console.log('onChange: ', onChange.toString());
        setValue(Number(e.target.value));
        onChange(Number(e.target.value));
    };

    return (
        <input
            className={s.count}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            style={st}
        />
    );
};

export default Slider;
