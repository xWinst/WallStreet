import { useRef } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, style = {}, children }) => {
    const modal = useRef();
    const x = useRef();
    const y = useRef();

    const dragModal = (clientX, clientY) => {
        const left = modal.current.getBoundingClientRect().left;
        const top = modal.current.getBoundingClientRect().top;
        modal.current.style.left = `${left + clientX - x.current}px`;
        modal.current.style.top = `${top + clientY - y.current}px`;
        x.current = clientX;
        y.current = clientY;
    };

    const onTouchDrag = e => {
        e.preventDefault();
        const { clientX, clientY } = e.targetTouches[0];
        dragModal(clientX, clientY);
    };

    const onDrag = e => {
        const { clientX, clientY } = e;
        dragModal(clientX, clientY);
    };

    const addListener = e => {
        console.log('ADD');
        x.current = e.clientX;
        y.current = e.clientY;
        document.addEventListener('mousemove', onDrag);
        modal.current.addEventListener('touchmove', onTouchDrag);
    };

    const removeListener = e => {
        console.log('REMOVE');
        document.removeEventListener('mousemove', onDrag);
        modal.current.removeEventListener('touchmove', onTouchDrag);
    };

    const onClick = event => {
        // if (event.target === event.currentTarget) onClose();
    };

    return createPortal(
        <div className={s.overlay} onClick={onClick}>
            <div
                className={s.modal}
                ref={modal}
                style={style}
                onPointerDown={addListener}
                onMouseUp={removeListener}
                onTouchEnd={removeListener}
            >
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
