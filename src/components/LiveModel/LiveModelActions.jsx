import React from 'react';
import { Button, CardActions, Link, Typography } from '@material-ui/core';
import { AddPhotoAlternate } from '@material-ui/icons';
import styles from 'components/LiveModel/LiveModel.module.scss';
import TensorFlowService from 'services/TensorFlowService';
import Database from 'services/Database';
import * as tf from '@tensorflow/tfjs';
import { getModelFormRoute } from 'services/RoutingService';
import DialogService from 'services/DialogService';
import PropTypes from 'prop-types';
import { T_MODEL_ITEM } from 'app-prop-types';
import useRouting from 'hooks/useRouting';
import Message from 'components/Message/Message';

const LiveModelActions = ({modelItem, saveModelItem, isDatasetLoadingEnded, webcam}) => {
    const routing = useRouting();

    const refreshTrainingInfo = async () => {
        const updatedData = {...modelItem, nbTrainings: TensorFlowService.getNbTrainings()};
        saveModelItem(updatedData);
    };

    const handleCapture = async (classId) => {
        const img = await webcam.current.capture();
        await TensorFlowService.trainCategory(classId, img);
        await refreshTrainingInfo();
        await Database.saveModelDatasetItem({modelId: modelItem.id, data: TensorFlowService.getStorableKnnDataset()});
        img.dispose();
        await tf.nextFrame();
    };

    const handleTeachingsDetails = () => {
        if (!modelItem.nbTrainings) return;
        const categoriesCounts = TensorFlowService.getCategoriesCounts();
        DialogService.showTrainingDetails(categoriesCounts);
    };

    const buttons = modelItem.categories
        .map(category => <Button color='primary' key={category} variant='outlined'
                                 onMouseDown={() => handleCapture(category)}>{category}</Button>);

    const trainingInfo = <Typography variant='body2' gutterBottom={true}>
        <Link onClick={handleTeachingsDetails}>
            {modelItem.nbTrainings ? `Trained with ${modelItem.nbTrainings} images` : 'Not trained yet'}
        </Link>
    </Typography>;

    if (modelItem.isCommunityModel) {
        if (!isDatasetLoadingEnded) return <Message.Loading/>;
        else if (!TensorFlowService.getNbTrainings()) {
            return <Typography variant='body2' color='textSecondary' gutterBottom={true}>
                Please come back later
            </Typography>;
        }
        const handleEdit = () => routing.push(getModelFormRoute(modelItem.id));
        return (
            <React.Fragment>
                <Typography variant='body2' gutterBottom={true}>
                    This is a Community Model, you can save it to your models if you want to modify it.
                </Typography>
                <Button color='primary' onClick={handleEdit} startIcon={<AddPhotoAlternate/>}>
                    Save to my models
                </Button>
            </React.Fragment>
        )
    }

    return (
        <div>
            <Typography color={modelItem.nbTrainings ? 'textPrimary' : 'secondary'}>
                Teach the IA that the current image is :
            </Typography>
            <div className={styles.actionsWrapper}>
                <CardActions className={styles.actions}>
                    {buttons}
                </CardActions>
            </div>
            {trainingInfo}
        </div>
    )
};

LiveModelActions.propTypes = {
    modelItem: T_MODEL_ITEM.isRequired,
    isDatasetLoadingEnded: PropTypes.bool.isRequired,
    saveModelItem: PropTypes.func.isRequired,
    webcam: PropTypes.object.isRequired
};

export default LiveModelActions;
