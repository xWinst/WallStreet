import { useState, useEffect } from 'react';

export const useInner = () => {
    const [width, setWidth] = useState(window.innerWidth);
    // const [height, setHeight] = useState(window.innerHeight);

    const handleResize = () => {
        setWidth(window.innerWidth);
        // setHeight(window.innerHeight);
        document.documentElement.style.fontSize =
            Math.floor(Math.sqrt(window.innerWidth) / 2) + 'px';
    };

    useEffect(() => {
        document.documentElement.style.fontSize =
            Math.floor(Math.sqrt(window.innerWidth) / 2) + 'px';
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { width };
};
