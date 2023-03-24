import { useRef } from 'react';

export const useDrop = () => {
    const target = useRef();
    const x = useRef();
    const y = useRef();

    const dragModal = (clientX, clientY) => {
        const left = target.current.getBoundingClientRect().left;
        const top = target.current.getBoundingClientRect().top;
        target.current.style.left = `${left + clientX - x.current}px`;
        target.current.style.top = `${top + clientY - y.current}px`;
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
        target.current.addEventListener('touchmove', onTouchDrag);
    };

    const removeListener = e => {
        console.log('REMOVE');
        document.removeEventListener('mousemove', onDrag);
        target.current.removeEventListener('touchmove', onTouchDrag);
    };

    const options = {
        onPointerDown: addListener,
        onMouseUp: removeListener,
        onTouchEnd: removeListener,
    };

    return [target, options];
};
