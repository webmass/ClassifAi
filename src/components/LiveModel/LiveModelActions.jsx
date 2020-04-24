import { Button, CardActions, Link, Typography } from '@material-ui/core';
import styles from 'components/LiveModel/LiveModel.module.scss';
import React, { useState } from 'react';
import TensorFlowService from 'services/TensorFlowService';
import { updateModelItem } from 'store/slices/modelsSlice';
import Database from 'services/Database';
import * as tf from '@tensorflow/tfjs';
import { getModelFormRoute } from 'services/RoutingService';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import DialogService from 'services/DialogService';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';

const LiveModelActions = ({modelItem, webcam, updateModelItem}) => {
    const [nbTeachedImages, setNbTeachedImages] = useState(modelItem.nbTeachedImages);
    let history = useHistory();
    if (modelItem.isCommunityModel) {
        const handleEdit = () => history.push({pathname: getModelFormRoute(modelItem.id), state: {details: modelItem}});
        return (
            <React.Fragment>
                <Typography variant='body1' gutterBottom={true}>
                    This is a Community Model, you can save it to your models if you want to modify it.
                </Typography>
                <Button color='primary' onClick={handleEdit}>Save to my models</Button>
            </React.Fragment>
        )
    }

    const handleCapture = async (classId) => {
        const img = await webcam.current.capture();
        await TensorFlowService.trainCategory(classId, img);
        const updatedData = {...modelItem, nbTeachedImages: TensorFlowService.getNbTeachedImages()};
        setNbTeachedImages(updatedData.nbTeachedImages);
        updateModelItem(updatedData);
        await Database.saveModelItem(updatedData);
        await Database.saveModelDatasetItem({modelId: modelItem.id, data: TensorFlowService.getStorableKnnDataset()});
        img.dispose();
        await tf.nextFrame();
    };

    const handleTeachingsDetails = () => {
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
            Trained with {nbTeachedImages} images
        </Link>
    </Typography>;

    return (
        <div>
            <Typography>Teach the IA that the current image is :</Typography>
            <div className={styles.actionsWrapper}>
                <CardActions className={styles.actions}>
                    {buttons}
                </CardActions>
                {nbTeachedImages ? trainingInfo : null}
            </div>
        </div>
    )
};

export default connect(null, {updateModelItem})(LiveModelActions);
