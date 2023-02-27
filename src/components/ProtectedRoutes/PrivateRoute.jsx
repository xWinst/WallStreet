import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { exitGameRoom } from 'state/gameOperation';

const PrivateRoute = () => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname !== '/createGame') exitGameRoom();
    }, [pathname]);

    return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
