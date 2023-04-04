import { useNavigate } from 'react-router-dom';
import { Button } from 'components';
import s from './HomeMenu.module.css';

const HomeMenu = () => {
    const navigate = useNavigate();

    // const play = () => {};

    return (
        <div className={s.container}>
            <p className={s.title}>Wall Street</p>
            {/* <Button cn={s.btn} text="Играть" click={() => play} /> */}
            <Button cn={s.btn} text="Войти" click={() => navigate('/login')} />
            <Button
                cn={s.btn}
                text="Создать аккаунт"
                click={() => navigate('/register')}
            />
            <Button
                cn={s.btn}
                text="Правила игры"
                click={() => navigate('/rules')}
            />
        </div>
    );
};

export default HomeMenu;
