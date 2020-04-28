import { Delete } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import React from 'react';
import Database from 'services/Database';
import { goHome } from 'services/RoutingService';
import { removeModelItem } from 'store/slices/modelsSlice';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DialogService from 'services/DialogService';
import { T_MODEL_ITEM } from 'types';
import PropTypes from 'prop-types';

const ModelDeleter = ({modelItem, removeModelItem}) => {
    const history = useHistory();
    const handleConfirmedDelete =  async (showResult, onClose) => {
        return new Promise((resolve, reject) => {
            Database.removeModelItem(modelItem.id)
                .then(() => {
                    Database.removeModelDatasetItem(modelItem.id);
                    removeModelItem(modelItem);
                    showResult('success');
                    goHome(history, true);
                    resolve();
                })
                .catch(() => showResult('error'))
        });
    };
    const handleDelete = () => DialogService.showDelete(modelItem.name, handleConfirmedDelete);
    return (
        <IconButton onClick={handleDelete} color="secondary"><Delete/></IconButton>
    );
};

ModelDeleter.propTypes = {
    modelItem: T_MODEL_ITEM.isRequired,
    removeModelItem: PropTypes.func.isRequired
};

export default connect(null, {removeModelItem})(ModelDeleter);
