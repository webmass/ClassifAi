import React, { useContext, useEffect, useRef, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import Page from 'components/Page/Page';
import styles from './ModelDetails.module.scss'
import LiveModel from 'components/LiveModel/LiveModel';
import Message from 'components/Message/Message';
import TopBar from 'components/TopBar/TopBar';
import { getModelFormRoute } from 'services/RoutingService';
import ModelPublishBar from 'components/Model/ModelPublishBar/ModelPublishBar';
import ModelService from 'services/ModelService';
import AppContext from 'app/AppContext';

const ModelDetails = () => {
    const {id} = useParams();
    const history = useHistory();
    const {wallet} = useContext(AppContext);
    const isMountedRef = useRef(true);
    const [modelItem, setModelItem] = useState(history.location.state ? history.location.state.details : {});
    const [hasError, setHasError] = useState(false);

    const handleError = () => setHasError(true);

    const handleEdit = () => history.push({pathname: getModelFormRoute(id), state: {details: modelItem}});

    useEffect(() => {
        const handleResponse = result => {
            if (!isMountedRef.current) return;
            if (result) {
                setModelItem(result);
            } else handleError();
        };
        if (!modelItem.id) {
            ModelService.getModelItem(id)
                .then(handleResponse)
                .catch(handleError);
        }
        return () => isMountedRef.current = false;

    }, [id, modelItem.id]);

    if (hasError) return <Page.Error>Model not found</Page.Error>;
    else if (!modelItem.id) return <Message.Loading/>;

    return (
        <Page>
            <TopBar title={modelItem.name}>
                {modelItem.isCommunityModel ? null : <IconButton onClick={handleEdit}><Edit/></IconButton>}
            </TopBar>
            <div className={styles.container}>
                <LiveModel modelItem={modelItem}/>
            </div>
            {modelItem.isCommunityModel || !wallet ? null : <ModelPublishBar modelItem={modelItem}/>}
        </Page>
    );
};

export default ModelDetails;
