import { createPortal } from 'react-dom';
import { useDrop } from 'hooks/useDrag';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, st = {}, children }) => {
    const options = useDrop();

    return createPortal(
        <div className={s.overlay}>
            <div className={s.modal} style={st} {...options}>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
