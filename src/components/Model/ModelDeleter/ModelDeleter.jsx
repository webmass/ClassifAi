import { Delete } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import React from 'react';
import DialogService from 'services/DialogService';
import { T_MODEL_ITEM } from 'app-prop-types';
import PropTypes from 'prop-types';
import useRouting from 'hooks/useRouting';
import { ROUTES } from 'app/constants';

const ModelDeleter = ({formData, removeModelItem}) => {
    const routing = useRouting();
    const handleConfirmedDelete =  async (showResult, onClose) => {
        return new Promise((resolve, reject) => {
            removeModelItem()
                .then(() => {
                    showResult('success');
                    routing.push(ROUTES.SEARCH_LOCAL);
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
