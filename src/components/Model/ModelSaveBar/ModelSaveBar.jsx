import { AppBar, Button, Toolbar } from '@material-ui/core';
import styles from 'containers/ModelForm/ModelForm.module.scss';
import React, { useState } from 'react';
import { getModelDetailsRoute } from 'services/RoutingService';
import ModelService from 'services/ModelService';
import DialogService from 'services/DialogService';
import { T_MODEL_ITEM } from 'app-prop-types';
import PropTypes from 'prop-types';
import useRouting from 'hooks/useRouting';

const ModelSaveBar = ({isFormValid, formData, renamedCategories, saveModelItem}) => {
    const routing = useRouting();
    const [isSaving, setIsSaving] = useState(false);

    const handleRenamedCategories = async (savedModel, renamedCategories) => {
        if(!Object.keys(renamedCategories).length) return;
        const result = await ModelService.renameModelDatasetCategories(savedModel.id, renamedCategories);
        if(result && result.nbTrainingsUpdateNeeded) {
            const recalculatedNbTrainings = await ModelService.getUpdatedNbTrainings(savedModel, saveModelItem);
            saveModelItem({...savedModel, nbTrainings: recalculatedNbTrainings});
        }
    };

    const save = async () => {
        setIsSaving(true);
        const modelToSaveLocally = {
            ...formData,
            nbTrainings: formData.nbTrainings || 0,
            isCommunityModel: false
        };
        if (formData.isCommunityModel) {
            const removeFields = ['id', 'datasetRefId', 'publicationTime', 'nbChunks', 'createdAt', 'updatedAt'];
            removeFields.forEach(field => delete modelToSaveLocally[field]);
            modelToSaveLocally.parentId = formData.id;
        }
        const savedModel = await saveModelItem(modelToSaveLocally);
        if(formData.datasetRefId) await ModelService.saveCommunityDatasetToLocal(formData.datasetRefId, savedModel.id);
        await handleRenamedCategories(savedModel, renamedCategories);
        return savedModel;
    };

    const handleSaveSuccess = (savedModel) => {
        setIsSaving(false);
        routing.push(getModelDetailsRoute(savedModel.id));
    };

    const handleError = (e) => {
        setIsSaving(false);
        DialogService.showError('An error occured :(');
    };

    const handleSave = async () => {
        save()
            .then(handleSaveSuccess)
            .catch(handleError)
    };
    return (
        <AppBar position="fixed" className={styles.bottomBar} style={{top: 'auto'}} color="primary">
            <Toolbar>
                <Button disabled={!isFormValid || isSaving} onClick={handleSave} color="inherit">
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </Toolbar>
        </AppBar>
    )
};

ModelSaveBar.propTypes = {
    formData: T_MODEL_ITEM.isRequired,
    isFormValid: PropTypes.bool.isRequired,
    renamedCategories: PropTypes.object,
    saveModelItem: PropTypes.func.isRequired,
};

export default ModelSaveBar;
