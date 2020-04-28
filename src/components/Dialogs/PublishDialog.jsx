import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import PropTypes from 'prop-types';

const PublishDialog = ({name, onClose, onConfirm}) => {
    const publishAnimationOptions = {animationName: 'publish', width: 150, height: 150, loop: true};
    const loadingAnimationOptions = {animationName: 'hexagone-loading', width: 150, height: 150, loop: true};
    const blockchainAnimationOptions = {animationName: 'blockchain', width: 250, height: 200, loop: true};
    return (
        <ConfirmDialog
            title='Publish on the Permaweb ?'
            yesLabel='Yes, Publish it!'
            initialAnimationOptions={publishAnimationOptions}
            loadingAnimationOptions={loadingAnimationOptions}
            successAnimationOptions={blockchainAnimationOptions}
            onClose={onClose}
            onConfirm={onConfirm}
        >
            <Typography variant="body1" gutterBottom={true}>
                This will publish the <b>"{name}"</b> model on <Link href="https://www.arweave.org/" target="_blank">Arweave's Permaweb</Link>,
                other people will then be able to use it and perhaps work on it.
            </Typography>
            <Typography variant="body1" gutterBottom={true}>
                Once on the permaweb it can <b>NEVER</b> be changed, removed or censored because the permaweb relies on
                the decentralized <Link href='https://en.wikipedia.org/wiki/Blockchain' target='_blank'>blockchain</Link> technology.
            </Typography>
        </ConfirmDialog>
    );
};

PublishDialog.propTypes = {
    name: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default PublishDialog;
