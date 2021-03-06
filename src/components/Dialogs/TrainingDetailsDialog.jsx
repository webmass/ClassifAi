import React from 'react';
import Typography from '@material-ui/core/Typography';
import SimpleDialog from 'components/Dialogs/SimpleDialog';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const TrainingDetailsDialog = ({counts, onClose}) => {
    const listItems = Object.keys(counts)
        .map(category => <ListItem key={category}>- {category} : {counts[category]}</ListItem>);

    return (
        <SimpleDialog>
            <div align='center'>
                <LottieAnimation animationName='information' width={100} height={100} loop={true}/>
                <Typography color={'primary'} gutterBottom={true}>
                    Number of images teached to each category :
                </Typography>
                <List>
                    {listItems}
                </List>
                <Typography variant={'body2'} gutterBottom={true}>
                    The more the model is trained and the more its guesses will be accurate.
                </Typography>
                <Typography variant={'body2'} gutterBottom={true}>
                    Moreover it's better to have a balanced number of images for each category.
                </Typography>
                <Typography variant={'body2'} gutterBottom={true}>
                    Visible image context also matters.
                </Typography>
                <Button color='primary' onClick={onClose}>Close</Button>
            </div>
        </SimpleDialog>
    );
};

TrainingDetailsDialog.propTypes = {
    counts: PropTypes.objectOf(PropTypes.number).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TrainingDetailsDialog;
