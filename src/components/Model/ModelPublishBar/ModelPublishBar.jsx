import { AppBar, Button, Toolbar } from '@material-ui/core';
import styles from 'containers/ModelForm/ModelForm.module.scss';
import React, { useContext } from 'react';
import AppContext from 'app/AppContext';
import ArweaveService from 'services/ArweaveService';
import TensorFlowService from 'services/TensorFlowService';
import DialogService from 'services/DialogService';
import { T_MODEL_ITEM } from 'app-prop-types';
import { AR_MIN_TRAINING_REQUIRED } from 'app/constants';

const ModelPublishBar = ({modelItem}) => {
    const {wallet} = useContext(AppContext);
    const handleConfirmedPublish = async (showResult) => {
        const dataset = TensorFlowService.getStorableKnnDataset();
        const result = await ArweaveService.publish(modelItem, dataset)
            .catch(reason => ({error: true, message: reason.message || reason.code}));
        if (!result.error) {
            showResult('success', result.message);
        } else {
            showResult('error', 'Could not publish : ' + result.message);
        }
    };
    const handlePublish = () => {
        if(modelItem.nbTrainings >= AR_MIN_TRAINING_REQUIRED){
            DialogService.showPublish(modelItem.name, handleConfirmedPublish);
        }
        else {
            DialogService.showInfo(`Only models trained with ${AR_MIN_TRAINING_REQUIRED} or more images can be published.`);
        }
    };
    return (
        <AppBar position="fixed" className={styles.bottomBar} style={{top: 'auto'}}>
            <Toolbar>
                <Button disabled={!wallet} onClick={handlePublish} color="inherit">Publish on Arweave's
                    PermaWeb</Button>
            </Toolbar>
        </AppBar>
    )
};

ModelPublishBar.propTypes = {
    modelItem: T_MODEL_ITEM.isRequired
};

export default ModelPublishBar;
