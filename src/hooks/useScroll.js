import { useEffect } from 'react';

export const useScroll = () => {
    const handleResize = () => {
        // window.scrollBy(0, 100);
        // setTimeout(window.scrollTo(0, 1), 0);
        // setTimeout(function () {
        //     document.body.style.height = window.outerHeight + 'px';
        //     setTimeout(function () {
        //         window.scrollTo(0, 50);
        //     }, 0);
        // }, 0);
    };

    useEffect(() => {
        // window.scrollBy(0, 100);
        // setTimeout(window.scrollTo(0, 1), 0);
        // setTimeout(function () {
        //     document.body.style.height = window.outerHeight + 'px';
        //     setTimeout(function () {
        //         window.scrollTo(0, 50);
        //     }, 0);
        // }, 0);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
};
