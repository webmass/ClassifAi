import React from 'react';
import styles from 'components/Dialogs/Dialogs.module.scss';

const SimpleDialog = ({children}) => {
    return (
        <div className={styles.simpleDialog}>
            {children}
        </div>
    )
};

export default SimpleDialog;
