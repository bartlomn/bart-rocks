import React, { FC, useCallback, useEffect, useState } from 'react';

import styles from './VisualFx.module.scss';

type VisualFxProps = {
    loadComplete: boolean;
};

const VisualFx: FC<VisualFxProps> = ({ loadComplete }): JSX.Element => {
    const [isInitialised, setInitialised] = useState<boolean>(false);
    const initCallback = useCallback(async () => {
        await Promise.all([import('three'), import('gsap')]);
    }, []);
    useEffect(() => {
        if (loadComplete && !isInitialised) {
            setTimeout(initCallback, 2500);
            setInitialised(true);
        }
    }, [loadComplete, isInitialised]);
    return <canvas data-testid="visual-fx" className={styles.vfx} />;
};

export default VisualFx;
