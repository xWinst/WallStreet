import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
// import { exitGameRoom } from 'state/gameOperation';
import { connectServer } from 'state/gameOperation';

const PrivateRoute = () => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    // const status = useSelector(state => state.game.status);
    // const { pathname } = useLocation();

    useEffect(() => {
        connectServer();
    }, []);

    // useEffect(() => {
    //     if (pathname !== '/createGame' && status === 'creating') exitGameRoom();
    // }, [pathname, status]);

    return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
