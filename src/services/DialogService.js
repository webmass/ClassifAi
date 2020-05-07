import { confirmAlert } from "react-confirm-alert";
import SimpleDialog from 'components/Dialogs/SimpleDialog';
import Message from 'components/Message/Message';
import { Button } from '@material-ui/core';
import React from 'react';
import DeleteDialog from 'components/Dialogs/DeleteDialog';
import PublishDialog from 'components/Dialogs/PublishDialog';
import TrainingDetailsDialog from 'components/Dialogs/TrainingDetailsDialog';
import IntroDialog from 'components/Dialogs/IntroDialog';

class DialogService {
    static show = (options) => confirmAlert(options);
    static showCustom = (renderFunction) => {
        this.show({
            customUI: renderFunction
        })
    };
    static showAlert = (children, onCloseExtra = () => {}, autoCloseDelay) => {
        this.showCustom(({ onClose }) => {
            const handleClose = () => {
                onCloseExtra();
                onClose();
            };
            if(autoCloseDelay){
                setTimeout(() => handleClose(), autoCloseDelay);
            }
            return (
                <SimpleDialog>
                    <div align='center'>
                        {children}
                        {autoCloseDelay ? null : <Button onClick={handleClose}>OK</Button>}
                    </div>
                </SimpleDialog>
            );
        });
    };

    static showSuccess = (message, onClose, autoCloseDelay) => this.showAlert(<Message.Success>{message}</Message.Success>, onClose, autoCloseDelay);
    static showError = message => this.showAlert(<Message.Error>{message}</Message.Error>);
    static showInfo = message => this.showAlert(<Message.Info>{message}</Message.Info>);

    static showDialog = (Component, options) => {
        this.showCustom(({ onClose }) => {
            return (
                <Component {...options} onClose={onClose}/>
            );
        });
    };
    static showDelete = (name, onConfirm) => this.showDialog(DeleteDialog, {name, onConfirm});
    static showPublish = (name, onConfirm) => this.showDialog(PublishDialog, {name, onConfirm});
    static showTrainingDetails = (counts) => this.showDialog(TrainingDetailsDialog, {counts});
    static showIntro = () => this.showDialog(IntroDialog);
}

export default DialogService;
