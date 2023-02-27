import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, style = {}, children }) => {
    const modal = useRef();
    const x = useRef();
    const y = useRef();

    useEffect(() => {
        const addListener = e => {
            if (e.target.nodeName === 'INPUT') return;
            const point = e.targetTouches ? e.targetTouches[0] : null;
            x.current = point?.clientX;
            y.current = point?.clientY;

            modal.current.addEventListener('mousemove', onDrag);
            modal.current.addEventListener('touchmove', onTouchDrag);
        };

        const removeListener = () => {
            modal.current.removeEventListener('mousemove', onDrag);
            modal.current.removeEventListener('touchmove', onTouchDrag);
        };

        const closeModal = event => {
            if (event.code === 'Escape') onClose();
        };

        window.addEventListener('keydown', closeModal);
        modal.current.addEventListener('mousedown', addListener);
        modal.current.addEventListener('touchstart', addListener);
        document.addEventListener('mouseup', removeListener);
        document.addEventListener('touchend', removeListener);

        return () => {
            window.removeEventListener('keydown', closeModal);
            // modal.current.removeEventListener('mousedown', addListener);
            // modal.current.removeEventListener('touchstart', addListener);
            document.removeEventListener('mouseup', removeListener);
            document.removeEventListener('touchend', removeListener);
        };
    }, [onClose]);

    const onTouchDrag = ({ targetTouches }) => {
        const { clientX, clientY } = targetTouches[0];
        const dragX = clientX - x.current;
        const dragY = clientY - y.current;
        x.current = clientX;
        y.current = clientY;
        const getStyle = window.getComputedStyle(modal.current);
        const leftVal = parseInt(getStyle.left);
        const topVal = parseInt(getStyle.top);
        modal.current.style.left = `${leftVal + dragX}px`;
        modal.current.style.top = `${topVal + dragY}px`;
    };

    const onDrag = ({ movementX, movementY }) => {
        const getStyle = window.getComputedStyle(modal.current);
        const leftVal = parseInt(getStyle.left);
        const topVal = parseInt(getStyle.top);
        modal.current.style.left = `${leftVal + movementX}px`;
        modal.current.style.top = `${topVal + movementY}px`;
    };

    const onClick = event => {
        // console.log('event.target: ', event.target);
        if (event.target === event.currentTarget) onClose();
    };

    return createPortal(
        <div className={s.overlay} onClick={onClick}>
            <div className={s.modal} ref={modal} style={style}>
                {children}
            </div>
        </div>,
        modalRoot
    );
};

export default Modal;
