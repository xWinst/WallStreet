import { useState, useEffect } from 'react';

export const useInner = () => {
    const [width, setWidth] = useState(window.innerWidth);
    // const [height, setHeight] = useState(window.innerHeight);

    const handleResize = () => {
        setWidth(window.innerWidth);
        // setHeight(window.innerHeight);
        // console.log('resize :)');
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // return { width, height };
    return { width };
};
