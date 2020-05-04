import { Button, CardActions, Link, Typography } from '@material-ui/core';
import styles from 'components/LiveModel/LiveModel.module.scss';
import React from 'react';
import TensorFlowService from 'services/TensorFlowService';
import Database from 'services/Database';
import * as tf from '@tensorflow/tfjs';
import { getModelFormRoute } from 'services/RoutingService';
import DialogService from 'services/DialogService';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import PropTypes from 'prop-types';
import { T_MODEL_ITEM } from 'types';
import useRouting from 'hooks/useRouting';

const LiveModelActions = ({modelItem, saveModelItem, isDatasetReady, webcam}) => {
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
        if(!modelItem.nbTrainings) return;
        const categoriesCounts = TensorFlowService.getCategoriesCounts();
        const counts = Object.keys(categoriesCounts)
            .map(category => <ListItem key={category}>- {category} : {categoriesCounts[category]}</ListItem>);
        DialogService.showCustom(({onClose}) => {
            return (
                <div align='center'>
                    <LottieAnimation animationName='information' width={100} height={100} loop={true}/>
                    <Typography color={'primary'}>
                        Number of images teached to each category :
                    </Typography>
                    <List>
                        {counts}
                    </List>
                    <Button color='primary' onClick={onClose}>CLOSE</Button>
                </div>
            )
        });
    };

    const buttons = modelItem.categories
        .map(category => <Button color='primary' key={category}
                                 onMouseDown={() => handleCapture(category)}>{category}</Button>);

    const trainingInfo = <Typography variant='body2' gutterBottom={true}>
        <Link onClick={handleTeachingsDetails}>
            {modelItem.nbTrainings ? `Trained with ${modelItem.nbTrainings} images` : 'Not trained yet'}
        </Link>
    </Typography>;

    if (modelItem.isCommunityModel) {
        if(!isDatasetReady) return null;
        const handleEdit = () => routing.push(getModelFormRoute(modelItem.id));
        return (
            <React.Fragment>
                <Typography variant='body1' gutterBottom={true}>
                    This is a Community Model, you can save it to your models if you want to modify it.
                </Typography>
                <Button color='primary' onClick={handleEdit}>Save to my models</Button>
            </React.Fragment>
        )
    }

    return (
        <div>
            <Typography color={modelItem.nbTrainings ? 'textPrimary' : 'secondary'}>Teach the IA that the current image is :</Typography>
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
    isDatasetReady: PropTypes.bool.isRequired,
    saveModelItem: PropTypes.func.isRequired,
    webcam: PropTypes.object.isRequired
};

export default LiveModelActions;
