import React from 'react';
import styles from 'components/Dialogs/Dialogs.module.scss';
import { T_CHILDREN } from 'app-prop-types';

const SimpleDialog = ({children}) => {
    return (
        <div className={styles.simpleDialog}>
            {children}
        </div>
    )
};

SimpleDialog.propTypes = {
    children: T_CHILDREN,
};

export default SimpleDialog;
