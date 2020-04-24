import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Typography, Button, Card, CardContent, CardHeader } from '@material-ui/core';
import TensorFlowService from 'services/TensorFlowService';
import * as tf from '@tensorflow/tfjs';
import styles from './LiveModel.module.scss';
import Message from 'components/Message/Message';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import ModelService from 'services/ModelService';
import LiveModelActions from 'components/LiveModel/LiveModelActions';

const LiveModel = ({modelItem}) => {
    const {id, description, isCommunityModel} = modelItem;
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

    useEffect(() => {
        const restoreTeachings = () => {
            TensorFlowService.clear();
            ModelService.getModelDatasetItem(id)
                .then(datasetItem => TensorFlowService.setKnnDataset(datasetItem.data))
                .catch(() => setResult({
                    label: isCommunityModel ? 'Training data still publishing...' : 'hmm...Teach me first !'
                }));
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
    }, [id, isCommunityModel, classifier, initWebcam]);

    return (
        <div className={styles.container}>
            <Card className={styles.card} raised={true}>
                <CardHeader title={description} subheader={`IA's guess : ${result.label}`}/>
                <CardContent className={styles.cardContent}>
                    <video className={styles.video} ref={videoRef} autoPlay playsInline muted width="224" height="224"/>
                    {
                        isWaitingCamera ?
                            <div className={styles.lottie}>
                                <LottieAnimation animationName="waiting-camera" loop={true}/>
                            </div>
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
                        <LiveModelActions modelItem={modelItem} webcam={webcam}/>
                }
            </Card>
        </div>
    );
};

export default LiveModel;
