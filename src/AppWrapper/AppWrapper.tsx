/* eslint-disable prefer-arrow/prefer-arrow-functions */
import React, { FC, Fragment, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import styles from './AppWrapper.module.scss';
import VisualFx from '../VisualFx';

type AppWrapperProps = PropsWithChildren<Record<string, unknown>>;

type Attr = { name: string; value: string };
type LinkMeta = {
    tagName: keyof HTMLElementTagNameMap;
    attrs: Attr[];
};

const fontsCss = `@font-face {
    font-family: cairo;
    src: url('/static/media/fonts/cairo/Cairo-Regular.ttf');
    font-style: normal;
    font-display: swap;
}`;

const AppWrapper: FC<AppWrapperProps> = ({ children }) => {
    const [loadCompleted, setLoadCompleted] = useState<boolean>(false);
    const applyReadyState = useCallback(() => {
        const _apply = async () => {
            // load the main css chunk
            if (process.env.NODE_ENV !== 'development') {
                const crititcalPathAssets = await fetch('/crit_path_assets.json').then((res) => res.json());
                crititcalPathAssets.forEach((linkMeta: LinkMeta) => {
                    const linkTag = document.createElement(linkMeta.tagName);
                    linkMeta.attrs.forEach((attr) => {
                        linkTag.setAttribute(attr.name, attr.value);
                    });
                    document.querySelector('head')?.appendChild(linkTag);
                });
            }
            // load fonts
            const fontsStyleTag = document.createElement('style');
            fontsStyleTag.appendChild(document.createTextNode(fontsCss));
            // document.fonts.onloadingdone is not working as expected (but of course) on Safari,
            // so we'll just wait for a bit before proceeding
            document.querySelector('head')?.appendChild(fontsStyleTag);
            setTimeout(() => {
                setLoadCompleted(true);
            }, 100);
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
            {/* This is our initial viewport to render */}
            {(!loadCompleted || navigator.userAgent === 'ReactSnap') && (
                <div
                    style={{
                        position: 'absolute',
                        width: '100vw',
                        height: '100vh',
                        background: 'transparent',
                    }}
                >
                    <span
                        style={{
                            position: 'relative',
                        }}
                    >
                        .
                    </span>
                </div>
            )}
            <div
                className={styles.overlay}
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '100vh',
                    background: 'radial-gradient(circle at 55% 55%, rgba(25, 35, 35, 1) 0.1%, rgb(0, 0, 0))',
                    zIndex: 1000,
                }}
            >
                <div className={styles.loaderWrapper}>
                    <span />
                    <span />
                    <span />
                </div>
            </div>
            <div className={styles.children} style={loadCompleted ? {} : { opacity: 0 }}>
                {children}
                <VisualFx loadComplete={loadCompleted} />
            </div>
        </Fragment>
    );
};

export default AppWrapper;
