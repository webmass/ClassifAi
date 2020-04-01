import { Delete } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import React from 'react';
import { confirmAlert } from "react-confirm-alert";
import DeleteDialog from 'components/Dialogs/DeleteDialog';
import Database from 'services/Database';
import { goHome } from 'services/RoutingService';
import { removeModelItem } from 'store/slices/modelsSlice';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

const ModelDeleter = ({modelItem, removeModelItem}) => {
    const history = useHistory();
    const handleConfirmedDelete =  async (showSucess, showError, onClose) => {
        return new Promise((resolve, reject) => {
            Database.removeModelItem(modelItem.id)
                .then(() => {
                    Database.removeModelDatasetItem(modelItem.id);
                    removeModelItem(modelItem);
                    showSucess();
                    // 1 sec to play animation and rest a tiny bit before leaving
                    setTimeout(() => {
                        onClose();
                        goHome(history, true);
                    }, 1000);
                    resolve();
                })
                .catch(showError)
        });
    };
    const handleDelete = (event) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <DeleteDialog name={modelItem.name} onClose={onClose} onDelete={handleConfirmedDelete}/>
                );
            }
        });
    };
    return (
        <IconButton onClick={handleDelete} color="secondary"><Delete/></IconButton>
    );
};

export default connect(null, {removeModelItem})(ModelDeleter);
