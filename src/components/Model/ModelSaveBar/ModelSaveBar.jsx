import { AppBar, Button, Toolbar } from '@material-ui/core';
import styles from 'containers/ModelForm/ModelForm.module.scss';
import React, { useState } from 'react';
import Database from 'services/Database';
import { getModelDetailsRoute, goBack, goHome } from 'services/RoutingService';
import { connect } from 'react-redux';
import { addModelItem, updateModelItem } from 'store/slices/modelsSlice';
import { useHistory } from 'react-router-dom';
import ModelService from 'services/ModelService';
import DialogService from 'services/DialogService';

const ModelSaveBar = ({isFormValid, modelItem, renamedCategories, updateModelItem, addModelItem}) => {
    const history = useHistory();
    const [isSaving, setIsSaving] = useState(false);

    const handleRenamedCategories = async (savedModel, renamedCategories) => {
        if(!Object.keys(renamedCategories).length) return;
        const result = await ModelService.renameModelDatasetCategories(savedModel.id, renamedCategories);
        if(result && result.nbTrainingsUpdateNeeded) {
            await ModelService.updateNbTrainings(savedModel, updateModelItem);
        }
    };

    const save = async () => {
        let saveType;
        setIsSaving(true);
        const modelToSaveLocally = {
            ...modelItem,
            nbTrainings: modelItem.nbTrainings || 0,
            isCommunityModel: false
        };
        if (modelItem.isCommunityModel) {
            delete modelToSaveLocally.id;
            modelToSaveLocally.parentId = modelItem.id;
        }
        const savedModel = await Database.saveModelItem(modelToSaveLocally);
        if (modelToSaveLocally.id) {
            updateModelItem(savedModel);
            saveType = 'update';
        } else {
            if (savedModel.parentId) await ModelService.saveCommunityDatasetToLocal(savedModel.parentId, savedModel.id);
            addModelItem(savedModel);
            saveType = 'create';
        }
        await handleRenamedCategories(savedModel, renamedCategories);
        return {savedModel, saveType};
    };

    const handleSaveSuccess = ({savedModel, saveType}) => {
        setIsSaving(false);
        if (saveType === 'create') {
            goHome(history);
            history.push({pathname: getModelDetailsRoute(savedModel.id)});
        } else {
            goBack(history);
        }
    };

    const handleError = () => {
        setIsSaving(false);
        DialogService.showError('An error occured while saving :(');
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

export default connect(null, {addModelItem, updateModelItem})(ModelSaveBar);
