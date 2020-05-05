import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import Page from 'components/Page/Page';
import styles from './ModelDetails.module.scss'
import LiveModel from 'components/LiveModel/LiveModel';
import Message from 'components/Message/Message';
import TopBar from 'components/TopBar/TopBar';
import { getModelFormRoute } from 'services/RoutingService';
import ModelPublishBar from 'components/Model/ModelPublishBar/ModelPublishBar';
import AppContext from 'app/AppContext';
import useModelItem from 'hooks/useModelItem';
import TensorFlowService from 'services/TensorFlowService';
import ModelService from 'services/ModelService';
import * as tf from '@tensorflow/tfjs';
import { ROUTES } from 'app/constants';

const ModelDetails = () => {
    const {id} = useParams();
    const isCommunityModel = ModelService.isCommunityId(id);
    const history = useHistory();
    const {wallet} = useContext(AppContext);
    const {modelItem, saveModelItem, isLoading, hasError} = useModelItem(id);
    const [isDatasetReady, setIsDatasetReady] = useState(false);
    const [isWaitingCamera, setIsWaitingCamera] = useState(false);
    const [hasCameraError, setHasCameraError] = useState(false);
    const [result, setResult] = useState('...');
    const lastResultRef = useRef(result);
    const videoRef = useRef(null);
    const webcam = useRef(null);
    const isMountedRef = useRef(true);

    const handleEdit = () => history.push({pathname: getModelFormRoute(id), state: {from: 'details'}});

    const handleCameraStatus = (hasError) => {
        setIsWaitingCamera(hasError);
        setHasCameraError(hasError);
    };

    const initWebcam = useCallback(async () => {
        setIsWaitingCamera(true);
        if(videoRef.current){
            const currentWebcam = await tf.data.webcam(videoRef.current).catch(() => null);
            handleCameraStatus(!currentWebcam);
            webcam.current = currentWebcam;
        }
    }, []);

    useEffect(() => {
        isMountedRef.current = true;
        const showNoTrainingInfo = () => setResult(isCommunityModel ? 'Training data still publishing...' : 'hmm...Teach me first !');
        const handleRestoreFailed = () => {
            if(isMountedRef.current) showNoTrainingInfo();
        };
        const handleRestoreSuccess = datasetItem => {
            if(isMountedRef.current){
                if(datasetItem && datasetItem.data && Object.keys(datasetItem.data).length){
                    setIsDatasetReady(true);
                } else {
                    showNoTrainingInfo();
                }
            }
            return datasetItem;
        };
        if(modelItem.id){
            const datasetRefId = modelItem.datasetRefId || modelItem.id;
            ModelService.restoreTraining(datasetRefId, handleRestoreSuccess, handleRestoreFailed);
        }
        const workWithCamera = async () => {
            await initWebcam();
            while (isMountedRef.current) {
                if (webcam.current && TensorFlowService.getNumClasses() > 0) {
                    const prediction = await TensorFlowService.getPredictionFromWebcam(webcam.current);
                    if (prediction && isMountedRef.current && lastResultRef.current !== prediction.label) {
                        setResult(prediction.label);
                        lastResultRef.current = prediction.label;
                    }
                }
                await tf.nextFrame();
            }
        };
        workWithCamera();
        return () => isMountedRef.current = false;
    }, [modelItem.id, modelItem.datasetRefId, isCommunityModel, initWebcam]);

    if (hasError) return <Page.Error>Model not found</Page.Error>;
    else if (isLoading){
        return <Message.Loading/>;
    }

    return (
        <Page hasBottomBar={true}>
            <TopBar title={modelItem.name} backPath={isCommunityModel ? ROUTES.SEARCH_COMMUNITY : ROUTES.SEARCH_LOCAL }>
                {isCommunityModel ? null : <IconButton onClick={handleEdit}><Edit/></IconButton>}
            </TopBar>
            <div className={styles.container}>
                <LiveModel
                    modelItem={modelItem}
                    saveModelItem={saveModelItem}
                    classificationResult={result}
                    isDatasetReady={isDatasetReady}
                    isWaitingCamera={isWaitingCamera}
                    hasCameraError={hasCameraError}
                    webcam={webcam}
                    initWebcam={initWebcam}
                >
                    <div className={styles.videoWrapper}>
                        <video className={styles.video} ref={videoRef} autoPlay playsInline muted width="224"
                               height="224"/>
                    </div>
                </LiveModel>
            </div>
            {isCommunityModel || !wallet ? null : <ModelPublishBar modelItem={modelItem}/>}
        </Page>
    );
};

export default ModelDetails;
