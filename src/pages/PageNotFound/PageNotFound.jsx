import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

import Button from '../../components/Button/Button';
import s from './PageNotFound.module.css';

const PageNotFound = () => {
    const navigate = useNavigate();
    // const lang = useSelector(state => state.user.lang);

    const handleBtnClick = () => {
        navigate('/', { replace: true });
    };

    return (
        <div className={s.container}>
            <div className={s.background}>
                <h2 className={s.title}>404 Сторінка не знайдена</h2>
                <div className={s.img}></div>
                <p className={s.text}>
                    Ой! Сторінка, яку ви шукаєте, не існує.
                </p>

                <Button onClick={handleBtnClick} text="На домашню" />
            </div>
        </div>
    );
};

export default PageNotFound;
