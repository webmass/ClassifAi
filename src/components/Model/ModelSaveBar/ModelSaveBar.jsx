import { AppBar, Button, Toolbar } from '@material-ui/core';
import styles from 'containers/ModelForm/ModelForm.module.scss';
import React from 'react';
import Database from 'services/Database';
import { getModelDetailsRoute, goBack } from 'services/RoutingService';
import { connect } from 'react-redux';
import { addModelItem, updateModelItem } from 'store/slices/modelsSlice';
import { useHistory } from 'react-router-dom';

const ModelSaveBar = ({isFormValid, modelItem, updateModelItem, addModelItem}) => {
    const history = useHistory();
    const handleSave = async () => {
        const savedModel = await Database.saveModelItem(modelItem);
        if(modelItem.id){
            updateModelItem(savedModel);
            goBack(history);
        } else {
            addModelItem(savedModel);
            goBack(history);
            history.push({pathname: getModelDetailsRoute(savedModel.id), state: {details: savedModel}});
        }
    };
    return (
        <AppBar position="fixed" className={styles.bottomBar} style={{top: 'auto'}} color="primary">
            <Toolbar>
                <Button disabled={!isFormValid} onClick={handleSave} color="inherit">Save</Button>
            </Toolbar>
        </AppBar>
    )
};

export default connect(null, {addModelItem, updateModelItem})(ModelSaveBar);
