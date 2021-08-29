import React from 'react';

import styles from './Headings.module.scss';

const Headings = (): JSX.Element => {
    return (
        <>
            <h1 className={styles.h1}>Bart Nowak.</h1>
            <hr className={styles.hr} />
            <h2 className={styles.h2}>
                Hands-on contributor. <br />
                Technology strategist. <br />
                Servant team leader.
            </h2>
            <hr className={styles.hr} />
            <section className={styles.mainSection}>
                It was in the year 2000 that I had been first asked to build a website. Ever since then, I have been
                delivering digital products and services across a multitude of market domains.
            </section>
        </>
    );
};

export default Headings;
