import React, { FC, Fragment, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import styles from './AppWrapper.module.scss';
import VisualFx from '../VisualFx';

type AppWrapperProps = PropsWithChildren<Record<string, unknown>>;

type Attr = { name: string; value: string };
type LinkMeta = {
    tagName: keyof HTMLElementTagNameMap;
    attrs: Attr[];
};

const AppWrapper: FC<AppWrapperProps> = ({ children }) => {
    const [loadCompleted, setLoadCompleted] = useState<boolean>(false);
    const applyReadyState = useCallback(() => {
        const _apply = async () => {
            const crititcalPathAssets = await fetch('/crit_path_assets.json').then((res) => res.json());
            crititcalPathAssets.forEach((linkMeta: LinkMeta) => {
                const linkTag = document.createElement(linkMeta.tagName);
                linkMeta.attrs.forEach((attr) => {
                    linkTag.setAttribute(attr.name, attr.value);
                });
                document.querySelector('head')?.appendChild(linkTag);
            });
            setLoadCompleted(true);
        };
        if (process.env.NODE_ENV === 'development') {
            setTimeout(() => {
                _apply();
            }, 2500);
        } else {
            _apply();
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
