import { useEffect } from 'react';

export const useMountTimer = (componentName) => {
    useEffect(() => {
        const startTime = performance.now();
        console.log(`[MOUNT START] ${componentName}`);
        
        return () => {
            const duration = performance.now() - startTime;
            console.log(`[UNMOUNT] ${componentName} - Was active for ${duration.toFixed(2)}ms`);
        };
    }, [componentName]);

    useEffect(() => {
        const mountTime = performance.now();
        // Since useEffect runs after mount, this is roughly the mount duration
        console.log(`[MOUNT COMPLETE] ${componentName} - Rendered in ~${mountTime.toFixed(2)}ms from hydration/start`);
    }, [componentName]);
};
