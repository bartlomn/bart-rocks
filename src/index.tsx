// we want global styles to be available from the very beggining
import './styles/global.scss';

const rootElement = document.getElementById('root');
const bootstrap = async () => {
    // dynamic import of react and app dependencies
    const [ReactDom, React, App, AppWrapper] = await Promise.all([
        import('react-dom'),
        import('react'),
        import('./App').then((module) => module.default),
        import('./AppWrapper').then((module) => module.default),
    ]);
    const { hydrate, render } = ReactDom;
    const { StrictMode } = React;
    if (rootElement?.hasChildNodes()) {
        // hydrate if pre-rendered by react-snap
        hydrate(
            <StrictMode>
                <AppWrapper>
                    <App />
                </AppWrapper>
            </StrictMode>,
            rootElement,
        );
    } else {
        // otherwise regular render
        render(
            <StrictMode>
                <AppWrapper>
                    <App />
                </AppWrapper>
            </StrictMode>,
            rootElement,
        );
    }
};

if (navigator.userAgent === 'ReactSnap' || process.env.NODE_ENV === 'development') {
    // if pre-rendering or in dev mode, render right away
    bootstrap();
} else {
    // otherwise wait for idle state
    window.requestIdleCallback(bootstrap);
}

export {};
