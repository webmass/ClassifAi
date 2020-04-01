import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Typography, Button, Card, CardContent, CardHeader, CardActions } from '@material-ui/core';
import TensorFlowService from 'services/TensorFlowService';
import * as tf from '@tensorflow/tfjs';
import StyledButton from 'components/StyledButton/StyledButton';
import styles from './LiveModel.module.scss';
import Database from 'services/Database';
import Message from 'components/Message/Message';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';

const LiveModel = ({modelItem}) => {
    const {id, name, description, categories} = modelItem;
    const [hasCameraError, setHasCameraError] = useState(false);
    const [isWaitingCamera, setIsWaitingCamera] = useState(true);
    const [result, setResult] = useState({label: '...'});
    const classifier = TensorFlowService.getKnnClassifier();
    const videoRef = useRef(null);
    const webcam = useRef(null);
    const isMountedRef = useRef(true);

    const handleCameraStatus = (hasError) => {
        setIsWaitingCamera(hasError);
        setHasCameraError(hasError);
    };

    const initWebcam = useCallback(async () => {
        setIsWaitingCamera(true);
        const currentWebcam = await tf.data.webcam(videoRef.current).catch(() => null);
        handleCameraStatus(!currentWebcam);
        webcam.current = currentWebcam;
    }, []);

    const handleCapture = async (classId) => {
        const img = await webcam.current.capture();
        await TensorFlowService.trainCategory(classId, img);
        await Database.saveModelDatasetItem({model_id: id, data: TensorFlowService.getStorableKnnDataset()});
        img.dispose();
        await tf.nextFrame();
    };

    const handleDownload = () => TensorFlowService.downloadModel(name);

    const buttons = categories
        .map(category => <Button color='primary' key={category}
                                 onMouseDown={() => handleCapture(category)}>{category}</Button>);

    useEffect(() => {
        const restoreTeachings = () => {
            Database.getModelDatasetItem(id)
                .then(datasetItem => TensorFlowService.setKnnDataset(datasetItem.data))
                .catch(() => setResult({label: 'hmm...Teach me first !'}));
        };
        const workWithCamera = async () => {
            await initWebcam();
            while (isMountedRef.current) {
                if (webcam.current && classifier.getNumClasses() > 0) {
                    const img = await webcam.current.capture().catch(() => null);
                    if (img) {
                        const prediction = await TensorFlowService.getImageKnnPrediction(img);
                        if (isMountedRef.current) setResult(prediction);
                        img.dispose();
                    }
                }
                await tf.nextFrame();
            }
        };
        restoreTeachings();
        workWithCamera();
        return () => isMountedRef.current = false;
    }, [id, classifier, initWebcam]);

    return (
        <div className={styles.container}>
            <Card className={styles.card} raised={true}>
                <CardHeader title={description} subheader={`IA's guess : ${result.label}`}/>
                <CardContent className={styles.cardContent}>
                    <video className={styles.video} ref={videoRef} autoPlay playsInline muted width="224" height="224"/>
                    {
                        isWaitingCamera ?
                            <div className={styles.lottie}><LottieAnimation animationName="waiting-camera" loop={true}/></div>
                            : null
                    }
                </CardContent>
                {
                    hasCameraError ?
                        <Message.Error>
                            <Typography>Could not access camera</Typography>
                            <Typography variant="body2">Please allow access to camera and try again</Typography>
                            <Button color="primary" onClick={initWebcam}>Retry</Button>
                        </Message.Error>
                        :
                        <div>
                            <Typography>Teach the IA that the current image is :</Typography>
                            <div className={styles.actionsWrapper}>
                                <CardActions className={styles.actions}>
                                    {buttons}
                                </CardActions>
                            </div>
                        </div>
                }
            </Card>
            <StyledButton onClick={handleDownload}>
                Download Teachings
            </StyledButton>
        </div>
    );
};

export default LiveModel;
