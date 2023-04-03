import { useEffect, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import {
    Home,
    Register,
    Login,
    Main,
    GameRoom,
    Rules,
    PageNotFound,
} from 'pages';
import {
    Loader,
    RestrictedRoute,
    PrivateRoute,
    GameList,
    GameLobby,
    UserMenu,
} from 'components';
import { refresh } from 'state/userOperations';

const Game = lazy(() => import('pages/Game'));

const App = () => {
    const isLoading = useSelector(state => state.user.isLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(refresh());
    }, [dispatch]);

    // console.log('isLoading: ', isLoading);
    return isLoading ? (
        <Loader />
    ) : (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route element={<RestrictedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<Login />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="main" element={<Main />}>
                        <Route path="games" element={<GameList />} />
                        <Route path="options" element={<UserMenu />} />
                    </Route>
                    <Route path="game" element={<Game />} />
                    <Route path="createGame" element={<GameRoom />} />
                    <Route path="game/:gameId" element={<GameLobby />} />
                </Route>
                <Route path="rules" element={<Rules />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    );
};

export default App;
