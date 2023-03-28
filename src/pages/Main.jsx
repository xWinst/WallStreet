import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MainMenu } from 'components';

const Main = () => {
    const id = useSelector(state => state.game.id);

    const navigate = useNavigate();

    useEffect(() => {
        if (id) navigate('/game');
    }, [id, navigate]);

    return <MainMenu />;
};

export default Main;
