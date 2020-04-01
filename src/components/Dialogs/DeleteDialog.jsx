import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './Dialogs.module.scss';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import Message from 'components/Message/Message';

const DeleteDialog = ({name, onClose, onDelete}) => {
    const [animationName, setAnimationName] = useState('trash');
    const [hadError, setHadError] = useState(false);

    const showSuccess = () => setAnimationName('checkmark');
    const showError = () => setHadError(true);

    if (hadError) {
        return (
            <div className={styles.confirmDialog}>
                <Message.Error>An error occured :(</Message.Error>
                <Button onClick={onClose}>OK</Button>
            </div>
        );
    }

    return (
        <div className={styles.confirmDialog}>
            <LottieAnimation animationName={animationName} loop={true} width={100} height={100}/>
            <Typography variant="h4" gutterBottom={true}>Are you sure?</Typography>
            <Typography variant="body1" gutterBottom={true}>Definitely delete <b>{name}</b> ?</Typography>
            <hr/>
            <div>
                <Button onClick={onClose}>No</Button>
                <Button color="secondary"
                        onClick={() => {
                            onDelete(showSuccess, showError, onClose);
                        }}
                >
                    Yes, Delete it!
                </Button>
            </div>
        </div>
    )
};

export default DeleteDialog;
