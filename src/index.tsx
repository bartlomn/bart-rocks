import './styles/global.scss';

const rootElement = document.getElementById('root');
const bootstrap = async () => {
    const [ReactDom, React, App, AppWrapper] = await Promise.all([
        import('react-dom'),
        import('react'),
        import('./App').then((module) => module.default),
        import('./AppWrapper').then((module) => module.default),
    ]);
    const { hydrate, render } = ReactDom;
    const { StrictMode } = React;
    if (rootElement?.hasChildNodes()) {
        hydrate(
            <StrictMode>
                <AppWrapper>
                    <App />
                </AppWrapper>
            </StrictMode>,
            rootElement,
        );
    } else {
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
    bootstrap();
} else {
    window.requestIdleCallback(bootstrap);
}

export {};
