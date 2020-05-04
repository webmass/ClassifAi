import { Delete } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import React from 'react';
import { goHome } from 'services/RoutingService';
import { useHistory } from 'react-router-dom';
import DialogService from 'services/DialogService';
import { T_MODEL_ITEM } from 'types';
import PropTypes from 'prop-types';

const ModelDeleter = ({formData, removeModelItem}) => {
    const history = useHistory();
    const handleConfirmedDelete =  async (showResult, onClose) => {
        return new Promise((resolve, reject) => {
            removeModelItem()
                .then(() => {
                    showResult('success');
                    goHome(history, true);
                    return resolve();
                })
                .catch(() => showResult('error'))
        });
    };
    const handleDelete = () => DialogService.showDelete(formData.name, handleConfirmedDelete);
    return (
        <IconButton onClick={handleDelete} color="secondary"><Delete/></IconButton>
    );
};

ModelDeleter.propTypes = {
    formData: T_MODEL_ITEM.isRequired,
    removeModelItem: PropTypes.func.isRequired
};

export default ModelDeleter;
