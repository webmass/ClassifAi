import React, { useEffect, useRef, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import Page from 'components/Page/Page';
import styles from './ModelDetails.module.scss'
import LiveModel from 'components/LiveModel/LiveModel';
import Database from 'services/Database';
import Message from 'components/Message/Message';
import TopBar from 'components/TopBar/TopBar';
import { getModelFormRoute } from 'services/RoutingService';

const ModelDetails = () => {
    let {id} = useParams();
    let history = useHistory();
    const isMountedRef = useRef(true);
    const [modelItem, setModelItem] = useState(history.location.state ? history.location.state.details : {});
    const [hasError, setHasError] = useState(false);

    const handleError = () => setHasError(true);

    const handleEdit = () => history.push({pathname: getModelFormRoute(id), state: {details : modelItem}});

    useEffect(() => {
        const handleDatabaseResponse = dbModelItem => {
            if(!isMountedRef.current) return;
            if(dbModelItem){
                setModelItem(dbModelItem);
            }
            else handleError();
        };
        if (!modelItem.id) {
            Database.getModelItem(id)
                .then(handleDatabaseResponse)
                .catch(handleError);
        }
        return () => isMountedRef.current = false;

    }, [id, modelItem.id]);

    if(hasError) return <Page.Error>Model not found</Page.Error>;
    else if(!modelItem.id) return <Message.Loading/>;

    return (
        <Page>
            <TopBar title={modelItem.name}>
                <IconButton onClick={handleEdit}><Edit/></IconButton>
            </TopBar>
            <div className={styles.container}>
                <LiveModel modelItem={modelItem}/>
            </div>
        </Page>
    );
};

export default ModelDetails;
