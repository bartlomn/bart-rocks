import React from 'react';
import Headings from '../Headings';

import styles from './App.module.scss';

const App = (): JSX.Element => {
    return (
        <main data-testid="app" className={styles.app}>
            <Headings />
        </main>
    );
};

export default App;
