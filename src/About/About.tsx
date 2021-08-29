import React from 'react';

import styles from './About.module.scss';

const About = (): JSX.Element => {
    return (
        <>
            <h1 className={styles.h1}>About</h1>
            <hr className={styles.hr} />
            <h2 className={styles.h2}>Dear Reader,</h2>
            <section className={styles.mainSection}>
                I have started my adventure as a graphic designer and got commissioned to build my first digital web
                project in the year 2000. <br />
                <br />
                Since then, I have gained experience in market areas such as Finance, Healthcare, eCommerce/Retail,
                including the privilege of working with Nike, HSBC, JP Morgan, and Sapient Global Markets, amongst
                others. <br />
                <br />
                Today, my main focus areas are end-to-end web architecture, efficient CI/CD processes, mentoring
                developers, and integration within a wider, business context. <br />
                <br />
                I am driven by the need to make a difference. I want to help other people succeed by empowering them to
                deliver at the top of their performance, while building systems and solutions that make a positive
                impact. <br />
                <br />
                Thank you for stopping by.
            </section>
        </>
    );
};

export default About;
