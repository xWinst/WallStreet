import { useNavigate } from 'react-router-dom';
import { Button } from 'components';

const UserMenu = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Button text="Статистика" />
            <Button text="Аватар" />
            <Button text="Что то еще" />
            <Button text="Правила игры" click={() => navigate('/rules')} />
        </div>
    );
};

export default UserMenu;
