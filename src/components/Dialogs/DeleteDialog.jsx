import React from 'react';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import Typography from '@material-ui/core/Typography';

const DeleteDialog = ({name, onClose, onConfirm}) => {
    const trashAnimationOptions = {animationName: 'trash', width: 100, height: 100, loop: true};
    return (
        <ConfirmDialog initialAnimationOptions={trashAnimationOptions} yesLabel='Yes, Delete it!' onClose={onClose} onConfirm={onConfirm}>
            <Typography variant='body1' align={'center'}>Definitely delete <b>{name}</b> ?</Typography>
        </ConfirmDialog>
    );
};

export default DeleteDialog;
