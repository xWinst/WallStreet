import { Icon } from 'components';
import s from './Button.module.css';

const Button = ({ cn, icon, text, onClick, type = 'button', st = {} }) => {
    return (
        <button
            className={s.button + ' ' + cn}
            type={type}
            onClick={onClick}
            style={st}
        >
            {icon && <Icon w="18" h="18" icon={icon} />}
            {text}
        </button>
    );
};

export default Button;
