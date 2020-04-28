import React from 'react';
import Typography from '@material-ui/core/Typography';
import SimpleDialog from 'components/Dialogs/SimpleDialog';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

const IntroDialog = ({onClose}) => {
    return (
        <SimpleDialog>
            <div align='center'>
                <LottieAnimation animationName='robot-welcome' width={150} height={150} loop={false}/>
                <Typography variant='h4' color={'primary'} gutterBottom={true}>
                    Welcome !
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant='body1'>
                            This web app let's you create and train image classifications models, it's optimized for mobile devices and offline.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='body1'>
                            Basically you teach the IA with your camera to which category the current image belongs to, once teached the IA can then guess what is on the camera !
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='body1' gutterBottom={true}>
                            To unlock the community models and the publish feature, check out the login page.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button color='primary' onClick={onClose}>OK, let's have fun !</Button>
                    </Grid>
                </Grid>
            </div>
        </SimpleDialog>
    );
};

IntroDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default IntroDialog;
