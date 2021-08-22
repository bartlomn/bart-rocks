// we want global styles to be available from the very beggining
import './styles/global.scss';

const rootElement = document.getElementById('root');
const bootstrap = async () => {
    // dynamic import of react and app dependencies
    const [ReactDom, React, ReactRouter, Headings, About, AppWrapper] = await Promise.all([
        import('react-dom'),
        import('react'),
        import('react-router-dom'),
        import('./Headings').then((module) => module.default),
        import('./About').then((module) => module.default),
        import('./AppWrapper').then((module) => module.default),
    ]);
    const { hydrate, render } = ReactDom;
    const { StrictMode } = React;
    const { BrowserRouter, Route, Switch } = ReactRouter;
    const getAppContent = () => (
        <StrictMode>
            <BrowserRouter>
                <AppWrapper>
                    <Switch>
                        <Route path="/about">
                            <About />
                        </Route>
                        <Route path="*">
                            <Headings />
                        </Route>
                    </Switch>
                </AppWrapper>
            </BrowserRouter>
        </StrictMode>
    );
    if (rootElement?.hasChildNodes()) {
        // hydrate if pre-rendered by react-snap
        hydrate(getAppContent(), rootElement);
    } else {
        // otherwise regular render
        render(getAppContent(), rootElement);
    }
};

if (navigator.userAgent === 'ReactSnap' || process.env.NODE_ENV === 'development') {
    // if pre-rendering or in dev mode, render right away
    bootstrap();
} else {
    // otherwise wait for a bit
    setTimeout(bootstrap, 2500);
}

export {};
