import React from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './ModelListItem.module.scss';
import { getModelDetailsRoute } from 'services/RoutingService';
import { useHistory } from 'react-router-dom';

const ModelListItem = ({modelItem}) => {
    const history = useHistory();
    const handleClick = () => {
        history.push({pathname: getModelDetailsRoute(modelItem.id), state: {details: modelItem}});
    };
    return (
        <div className={styles.itemContainer} onClick={handleClick}>
            <Typography variant='subtitle1' display='block' color='primary'>{modelItem.name}</Typography>
            <Typography variant='body2' display='block' color='textPrimary'>{modelItem.description}</Typography>
            <Typography variant='body2' display='block' color='textPrimary'>
                <i>{modelItem.nbTrainings ? `Trained with ${modelItem.nbTrainings} images` : 'The model is not trained yet'}</i>
            </Typography>
        </div>
    );
};

export default ModelListItem;
