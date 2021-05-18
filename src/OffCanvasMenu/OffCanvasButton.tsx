import React, { FC, PropsWithChildren } from 'react';
import cx from 'classnames';

type OCButtonProps = PropsWithChildren<{
    className?: string;
    onClick?: () => void;
}>;

const OffCanvasButton: FC<OCButtonProps> = ({ className, onClick, children }) => (
    <button aria-label="open main menu" className={cx(className)} onClick={onClick}>
        {children}
    </button>
);

export default OffCanvasButton;
