import { Button } from 'components';
import { useNavigate } from 'react-router-dom';
import s from './HomeMenu.module.css';

const HomeMenu = () => {
    const navigate = useNavigate();

    const play = () => {};

    return (
        <div className={s.container}>
            <p className={s.title}>Wall Street</p>
            <Button cn={s.btn} text="Играть" onClick={() => play} />
            <Button
                cn={s.btn}
                text="Войти"
                onClick={() => navigate('/login')}
            />
            <Button
                cn={s.btn}
                text="Создать аккаунт"
                onClick={() => navigate('/register')}
            />
            <Button cn={s.btn} text="Правила игры" />
        </div>
    );
};

export default HomeMenu;
