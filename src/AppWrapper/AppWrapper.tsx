import React, { FC, PropsWithChildren, useCallback, useEffect } from 'react';

import styles from './AppWrapper.module.scss';

type AppWrapperProps = PropsWithChildren<Record<string, unknown>>;

const AppWrapper: FC<AppWrapperProps> = ({ children }) => {
    const applyReadyState = useCallback(() => {
        document.querySelector('#root')?.classList.add('loadComplete');
    }, []);
    const readyStateChangeHandler = useCallback(() => {
        if (document.readyState === 'complete') {
            applyReadyState();
        }
    }, []);
    useEffect(() => {
        if (navigator.userAgent === 'ReactSnap') return;
        if(document.readyState === 'complete') {
            applyReadyState();
            return;
        }
        document.onreadystatechange = readyStateChangeHandler;
        return () => {
            document.onreadystatechange = null;
        };
    }, []);
    return (
        <div>
            <div
                className={styles.overlay}
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#000000',
                    zIndex: 1000,
                }}
            >
                <span style={{ position: 'relative', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    ...
                </span>
            </div>
            {children}
        </div>
    );
};

export default AppWrapper;
