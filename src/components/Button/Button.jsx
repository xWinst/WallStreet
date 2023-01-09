import { Icon } from 'components';
import s from './Button.module.css';

const Button = ({ icon, text, onClick, type = 'button' }) => {
    return (
        <button className={s.button} type={type} onClick={onClick}>
            {icon && <Icon width="18" height="18" href={icon} />}
            {text}
        </button>
    );
};

export default Button;
