import React, { FC, RefObject, useCallback, useEffect, useState } from 'react';
import { CgMenu, CgClose } from 'react-icons/cg';

import OffCanvasButton from './OffCanvasButton';

import styles from './OffCanvasMenu.module.scss';

const MENU_OPEN_CLASS = 'menuVisible';

type OCMenuProps = {
    canvasRef: RefObject<HTMLDivElement>;
};
const OffCanvasMenu: FC<OCMenuProps> = ({ canvasRef }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const clickHandler = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);
    useEffect(() => {
        if (canvasRef.current) {
            if (isOpen) canvasRef.current.classList.add(MENU_OPEN_CLASS);
            else canvasRef.current.classList.remove(MENU_OPEN_CLASS);
        }
    }, [canvasRef.current, isOpen]);
    return (
        <div className={styles.offCanvasMenu}>
            <OffCanvasButton className={styles.offCanvasButton} onClick={clickHandler}>
                {isOpen ? <CgClose /> : <CgMenu />}
            </OffCanvasButton>
        </div>
    );
};

export default OffCanvasMenu;
