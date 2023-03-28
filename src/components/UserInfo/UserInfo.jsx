import { useSelector } from 'react-redux';
import s from './UserInfo.module.css';

const UserInfo = ({ userName, userAvatar }) => {
    const { name, avatar } = useSelector(state => state.user);
    if (!userName) {
        userName = name;
        userAvatar = avatar;
    }

    return (
        <div className={s.player}>
            <img className={s.avatar} src={userAvatar} alt="avatar" />
            <p className={s.name}>{userName}</p>
        </div>
    );
};

export default UserInfo;
