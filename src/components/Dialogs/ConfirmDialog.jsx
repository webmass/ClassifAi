import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import SimpleDialog from 'components/Dialogs/SimpleDialog';
import PropTypes from 'prop-types';
import { T_ANIMATION, T_CHILDREN } from 'types';

const defaultSuccessAnimationOptions = {animationName: 'checkmark', width: 100, height: 100};
const defaultLoadingAnimationOptions = {animationName: 'progress-bar', width: 100, height: 100};
const defaultErrorAnimationOptions = {animationName: 'error', width: 100, height: 100};

const ConfirmDialog = ({
                           title = 'Are you sure?',
                           children = null,
                           onClose,
                           onConfirm,
                           yesLabel = 'Yes',
                           noLabel = 'No',
                           initialAnimationOptions = null,
                           loadingAnimationOptions = defaultLoadingAnimationOptions,
                           errorAnimationOptions = defaultErrorAnimationOptions,
                           successAnimationOptions = {...defaultSuccessAnimationOptions, onComplete: onClose}
                       }) => {
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const [resultType, setResultType] = useState(null);
    const [resultMessage, setResultMessage] = useState('');
    const [currentAnimation, setCurrentAnimation] = useState(initialAnimationOptions);

    const showResult = (type, message = '') => {
        setResultType(type);
        setResultMessage(message);
        setCurrentAnimation(type === 'error' ? errorAnimationOptions : successAnimationOptions);
    };

    const handleConfirm = () => {
        setCurrentAnimation(loadingAnimationOptions);
        setHasConfirmed(true);
        onConfirm(showResult, onClose);
    };

    const getInitialContent = () =>
        (
            <div>
                <Typography align="center" variant="h4" gutterBottom={true}>{title}</Typography>
                {children}
            </div>
        );
    const getConfirmButtons = () =>
        (
            <div>
                <Button disabled={hasConfirmed} onClick={onClose}>{noLabel}</Button>
                <Button disabled={hasConfirmed} onClick={handleConfirm} color="secondary">{yesLabel}</Button>
            </div>
        );

    const animation = currentAnimation ? <LottieAnimation {...currentAnimation}/> : null;
    let content;
    let buttons;
    if (resultType) {
        const hasAutoClose = successAnimationOptions && successAnimationOptions.onComplete;
        content = resultMessage ? <Typography variant='body1'>{resultMessage}</Typography> : null;
        buttons = (resultMessage && !hasAutoClose) ? <Button color="primary" onClick={onClose}>OK</Button> : null;
    } else {
        content = getInitialContent();
        buttons = getConfirmButtons();
    }
    return (
        <SimpleDialog>
            {animation}
            {content}
            {buttons}
        </SimpleDialog>
    );
};

ConfirmDialog.propTypes = {
    title: PropTypes.string,
    children: T_CHILDREN,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    yesLabel: PropTypes.string,
    noLabel: PropTypes.string,
    initialAnimationOptions: T_ANIMATION,
    loadingAnimationOptions: T_ANIMATION,
    errorAnimationOptions: T_ANIMATION,
    successAnimationOptions: T_ANIMATION,
};

export default ConfirmDialog;
