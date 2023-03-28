// import { useState } from 'react'; ////////////////
import { NavLink, Outlet } from 'react-router-dom';
import { UserInfo } from 'components';
import s from './MainMenu.module.css';
// import { connectServer } from 'state/gameOperation';

const getActive = ({ isActive }) => (isActive ? s.active : s.navLink);

const MainMenu = () => {
    // useEffect(() => {
    //     connectServer();
    // }, []);
    const setSetting = () => {};

    return (
        <div className={s.container}>
            <div onClick={setSetting} title="настроить аккаунт">
                <UserInfo />
            </div>
            <div className={s.nav}>
                <NavLink className={getActive} to="games">
                    Играть
                </NavLink>
                <NavLink className={getActive} to="options">
                    Опции
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
};

export default MainMenu;
