import React from 'react';
import Typography from '@material-ui/core/Typography';
import SimpleDialog from 'components/Dialogs/SimpleDialog';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';

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
                <Button color='primary' onClick={onClose}>Close</Button>
            </div>
        </SimpleDialog>
    );
};

export default TrainingDetailsDialog;
