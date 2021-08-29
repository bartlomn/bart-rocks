import React, { FC, Fragment, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import VisualFx from '../VisualFx';
import OffCanvasMenu from '../OffCanvasMenu';

import styles from './AppWrapper.module.scss';

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

const RESIZE_CLASS = 'isResizing';

const AppWrapper: FC<AppWrapperProps> = ({ children }) => {
    let resizeTmr: ReturnType<typeof setTimeout>;
    const [loadCompleted, setLoadCompleted] = useState<boolean>(false);
    const viewportRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const onResizeEnd = useCallback(() => {
        rootRef.current?.classList.remove(RESIZE_CLASS);
    }, []);
    const onResize = useCallback(() => {
        if (resizeTmr) clearTimeout(resizeTmr);
        resizeTmr = setTimeout(onResizeEnd, 500);
        if (!rootRef.current?.classList.contains(RESIZE_CLASS)) {
            rootRef.current?.classList.add(RESIZE_CLASS);
        }
    }, []);
    const applyReadyState = useCallback(() => {
        const _apply = async () => {
            // load the main css chunk
            // if (process.env.NODE_ENV !== 'development') {
            //     try {
            //         const crititcalPathAssets = await fetch('crit_path_assets.json')
            //             .then((res) => res.json())
            //             .catch((reason) => console.error(reason));
            //         crititcalPathAssets.forEach((linkMeta: LinkMeta) => {
            //             const linkTag = document.createElement(linkMeta.tagName);
            //             linkMeta.attrs.forEach((attr) => {
            //                 linkTag.setAttribute(attr.name, attr.value);
            //             });
            //             document.querySelector('head')?.appendChild(linkTag);
            //         });
            //     } catch (e) {
            //         console.error(e);
            //     }
            // }
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
        rootRef.current = document.querySelector('#root');
        // when pre-rendering ssg snapshot, we want pristine state
        if (navigator.userAgent === 'ReactSnap') return;
        if (document.readyState === 'complete') {
            applyReadyState();
            return;
        }
        document.onreadystatechange = readyStateChangeHandler;
        window.addEventListener('resize', onResize);
        return () => {
            document.onreadystatechange = null;
            window.removeEventListener('resize', onResize);
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
                        overflow: 'hidden',
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
                    overflow: 'hidden',
                }}
            >
                <div className={styles.loaderWrapper}>
                    <span />
                    <span />
                    <span />
                </div>
            </div>
            <OffCanvasMenu canvasRef={viewportRef} />
            <div ref={viewportRef} className={styles.children} style={loadCompleted ? {} : { opacity: 0 }}>
                <main data-testid="app" className={styles.app}>
                    {children}
                </main>
                <VisualFx loadComplete={loadCompleted} />
            </div>
        </Fragment>
    );
};

export default AppWrapper;
