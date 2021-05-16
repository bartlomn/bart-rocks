import React, { FC, Fragment, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import styles from './AppWrapper.module.scss';
import VisualFx from '../VisualFx';

type AppWrapperProps = PropsWithChildren<Record<string, unknown>>;

const AppWrapper: FC<AppWrapperProps> = ({ children }) => {
    const [loadCompleted, setLoadCompleted] = useState<boolean>(false);
    const applyReadyState = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            setTimeout(() => {
                // document.querySelector('#root')?.classList.add('loadComplete');
                setLoadCompleted(true);
            }, 2500);
        } else {
            // document.querySelector('#root')?.classList.add('loadComplete');
            setLoadCompleted(true);
        }
    }, []);
    const readyStateChangeHandler = useCallback(() => {
        if (document.readyState === 'complete') {
            applyReadyState();
        }
    }, []);
    useEffect(() => {
        // when pre-rendering ssg snapshot, we want pristine state
        if (navigator.userAgent === 'ReactSnap') return;
        if (document.readyState === 'complete') {
            applyReadyState();
            return;
        }
        document.onreadystatechange = readyStateChangeHandler;
        return () => {
            document.onreadystatechange = null;
        };
    }, []);
    return (
        <Fragment>
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
                <span
                    className={styles.loader}
                    style={{
                        position: 'relative',
                        left: '50%',
                        top: '50%',
                    }}
                >
                    ...
                </span>
            </div>
            <div className={styles.children} style={loadCompleted ? {} : { opacity: 0 }}>
                {children}
                <VisualFx loadComplete={loadCompleted} />
            </div>
        </Fragment>
    );
};

export default AppWrapper;
