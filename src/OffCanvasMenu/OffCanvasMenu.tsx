import React, { FC, useCallback, useEffect, useState } from 'react';
import { CgMenu, CgClose } from 'react-icons/cg';

import OffCanvasButton from './OffCanvasButton';

import styles from './OffCanvasMenu.module.scss';

const MENU_OPEN_CLASS = 'menuVisible';

type OCMenuProps = Record<string, any>;
const OffCanvasMenu: FC<OCMenuProps> = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const clickHandler = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);
    const closeActionHandler = useCallback(() => {
        setIsOpen(false);
    }, [])
    useEffect(() => {
        const rootRef = document.querySelector('#root');
        if (isOpen) {
            rootRef?.classList.add(MENU_OPEN_CLASS);
            window.addEventListener('resize', closeActionHandler);
            window.addEventListener('click', closeActionHandler);
        } else {
            rootRef?.classList.remove(MENU_OPEN_CLASS);
            window.removeEventListener('resize', closeActionHandler);
            window.removeEventListener('click', closeActionHandler);
        }
    }, [isOpen]);
    return (
        <div className={styles.offCanvasMenu}>
            <OffCanvasButton className={styles.offCanvasButton} onClick={clickHandler}>
                {isOpen ? <CgClose /> : <CgMenu />}
            </OffCanvasButton>

            <ul className={styles.list}>
                <li className={styles.listItem}>About</li>
                <li className={styles.listItem}>Projects</li>
                <li className={styles.listItem}>Contact</li>
            </ul>
        </div>
    );
};

export default OffCanvasMenu;
