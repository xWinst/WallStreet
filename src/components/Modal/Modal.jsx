import { createPortal } from 'react-dom';
import { useDrop } from 'hooks/useDrag';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, style = {}, children }) => {
    const [target, options] = useDrop();

    return createPortal(
        <div className={s.overlay}>
            <div className={s.modal} ref={target} style={style} {...options}>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
