import { createPortal } from 'react-dom';
import { useDrop } from 'hooks/useDrag';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, st = {}, children }) => {
    const [target, options] = useDrop();

    return createPortal(
        <div className={s.overlay}>
            <div className={s.modal} ref={target} style={st} {...options}>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
