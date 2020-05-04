import React from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './ModelListItem.module.scss';
import { getModelDetailsRoute } from 'services/RoutingService';
import { T_MODEL_ITEM } from 'types';
import useRouting from 'hooks/useRouting';

const ModelListItem = ({modelItem}) => {
    const routing = useRouting();
    const handleClick = () => {
        routing.push(getModelDetailsRoute(modelItem.id));
    };
    return (
        <div className={styles.itemContainer} onClick={handleClick}>
            <Typography variant='subtitle1' display='block' color='primary' noWrap={true}>{modelItem.name}</Typography>
            <Typography variant='body2' display='block' color='textPrimary' noWrap={true}>{modelItem.description}</Typography>
            <Typography variant='body2' display='block' color='textPrimary' noWrap={true}>
                <i>{modelItem.nbTrainings ? `Trained with ${modelItem.nbTrainings} images` : 'The model is not trained yet'}</i>
            </Typography>
        </div>
    );
};

ModelListItem.propTypes = {
    modelItem: T_MODEL_ITEM.isRequired
};

export default ModelListItem;
