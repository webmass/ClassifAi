import React from 'react';
import { Typography, Button, Card, CardContent, CardHeader } from '@material-ui/core';
import styles from './LiveModel.module.scss';
import Message from 'components/Message/Message';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import LiveModelActions from 'components/LiveModel/LiveModelActions';
import { T_CHILDREN, T_MODEL_ITEM } from 'types';
import PropTypes from 'prop-types';

const LiveModel = ({
                       children,
                       modelItem,
                       saveModelItem,
                       initWebcam,
                       classificationResult,
                       isDatasetReady,
                       isWaitingCamera,
                       hasCameraError,
                       webcam
                   }) => {
    return (
        <div className={styles.container}>
            <Card className={styles.card} raised={true}>
                <CardHeader
                    title={
                        <Typography variant='subtitle1' gutterBottom={true}>{modelItem.description}</Typography>
                    }
                    titleTypographyProps={{variant: 'subtitle1', gutterBottom: true}}
                    disableTypography={true}
                    subheader={(
                        <React.Fragment>
                            <Typography color='primary' variant='body1'>IA's guess : </Typography>
                            <Typography variant='body1' noWrap={true}>{classificationResult}</Typography>
                        </React.Fragment>
                    )}
                />
                <CardContent className={styles.cardContent}>
                    {children}
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
                        <LiveModelActions
                            modelItem={modelItem}
                            saveModelItem={saveModelItem}
                            webcam={webcam}
                            isDatasetReady={isDatasetReady}/>
                }
            </Card>
        </div>
    );
};

LiveModel.propTypes = {
    children: T_CHILDREN,
    modelItem: T_MODEL_ITEM.isRequired,
    saveModelItem: PropTypes.func.isRequired,
    initWebcam: PropTypes.func.isRequired,
    classificationResult: PropTypes.string.isRequired,
    isDatasetReady: PropTypes.bool.isRequired,
    hasCameraError: PropTypes.bool.isRequired,
    isWaitingCamera: PropTypes.bool.isRequired,
    webcam: PropTypes.object
};

export default LiveModel;
