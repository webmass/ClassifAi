import React, { useCallback, useEffect, useRef, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './ModelListItem.module.scss';
import { getModelDetailsRoute } from 'services/RoutingService';
import { T_MODEL_ITEM } from 'app-prop-types';
import useRouting from 'hooks/useRouting';
import moment from 'moment';

const ModelListItem = ({modelItem}) => {
    const routing = useRouting();

    const getTimeInfo = useCallback(() => {
        const createdOrUpdated = modelItem.updatedAt === modelItem.createdAt ? 'created' : 'updated';
        const timeWording = modelItem.isCommunityModel ? 'published' : createdOrUpdated;
        const relevantTime = modelItem.isCommunityModel ? modelItem.publicationTime : modelItem.updatedAt;
        return `${timeWording} ${moment(relevantTime).fromNow()}`;
    }, [modelItem.isCommunityModel,  modelItem.publicationTime, modelItem.updatedAt, modelItem.createdAt]);

    const [timeInfo, setTimeInfo] = useState(getTimeInfo());
    const isMountedRef = useRef(true);
    const interval = useRef(0);

    const handleClick = () => {
        routing.push(getModelDetailsRoute(modelItem.id));
    };

    useEffect(() => {
        const updateTimeInfo = () => {
            if (isMountedRef.current) {
                setTimeInfo(getTimeInfo());
            }
        };
        interval.current = setInterval(() => {
            updateTimeInfo();
        }, 1000)
        return () => {
            if(interval.current) clearInterval(interval.current);
            isMountedRef.current = false;
        }
    }, [getTimeInfo]);

    return (
        <div className={styles.itemContainer} onClick={handleClick}>
            <Typography variant='subtitle1' display='block' color='primary' noWrap={true}>{modelItem.name}</Typography>
            <Typography variant='body2' display='block' color='textPrimary'
                        noWrap={true}>{modelItem.description}</Typography>
            <Typography variant='body2' color='textPrimary' noWrap={true} className={styles.itemFooter}>
                <i>{modelItem.nbTrainings ? `Trained with ${modelItem.nbTrainings} images` : 'Model not trained yet'}</i>
                <span className={styles.timeInfo}>{timeInfo}</span>
            </Typography>
        </div>
    );
};

ModelListItem.propTypes = {
    modelItem: T_MODEL_ITEM.isRequired
};

export default ModelListItem;
