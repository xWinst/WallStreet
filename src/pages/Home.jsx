import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { HomeMenu } from 'components';
import { setToken } from 'state/userOperations';
import { setUser } from 'state/userReducer';

const Home = () => {
    const [searchParams] = useSearchParams();

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const user = JSON.parse(searchParams.get('user'));
    const dispatch = useDispatch();

    useEffect(() => {
        if (accessToken && refreshToken) {
            setToken(accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            dispatch(setUser({ accessToken, refreshToken, user }));
        }
    }, [accessToken, refreshToken, dispatch, user]);
    return (
        <div className="container">
            {/* <p className="title">Wall Street</p> */}
            <HomeMenu />
        </div>
    );
};

export default Home;
