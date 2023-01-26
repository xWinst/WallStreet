import { Icon } from 'components';
import s from './Button.module.css';

const Button = ({ icon, text, onClick, type = 'button', style = {} }) => {
    return (
        <button
            className={s.button}
            type={type}
            onClick={onClick}
            style={style}
        >
            {icon && <Icon w="18" h="18" icon={icon} />}
            {text}
        </button>
    );
};

export default Button;
