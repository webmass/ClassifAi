import React, { useContext, useEffect, useRef, useState } from 'react';
import { Typography, Grid, Container } from '@material-ui/core';
import { Add, Person, PersonOutline } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Page from 'components/Page/Page';
import styles from './Home.module.scss';
import { DB_INTRO_DONE_SETTING, ROUTES } from 'app/constants';
import ModelList from 'components/Model/ModelList/ModelList';
import StyledButton from 'components/StyledButton/StyledButton';
import AppContext from 'app/AppContext';
import { connect } from 'react-redux';
import ArweaveService from 'services/ArweaveService';
import TopBar from 'components/TopBar/TopBar';
import IconButton from '@material-ui/core/IconButton';
import { goToAccount } from 'services/RoutingService';
import DialogService from 'services/DialogService';
import Button from '@material-ui/core/Button';
import Database from 'services/Database';

const Home = ({models}) => {
    const {wallet} = useContext(AppContext);
    let history = useHistory();
    const isMountedRef = useRef(true);
    const [communityModels, setCommunityModels] = useState([]);

    const handleAdd = () => history.push(ROUTES.MODEL_FORM);

    const getCommunityModels = () => {
        ArweaveService.getAllModels()
            .then(result => {
                if(isMountedRef.current){
                    setCommunityModels(result.data)
                }
            })
            .catch(() => setCommunityModels([]))
    };

    const handleAccount = () => goToAccount(history);
    const handleIntro = () => {
        DialogService.showIntro();
        Database.saveSettingItem({name: DB_INTRO_DONE_SETTING, value: true});
    };

    useEffect(() => {
        Database.getSettingItem(DB_INTRO_DONE_SETTING)
            .then(result => !result ? handleIntro() : null)
            .catch();
    }, []);

    useEffect(() => {
        isMountedRef.current = true;
        if(wallet){
            getCommunityModels();
        }
        return () => isMountedRef.current = false;
    }, [wallet]);

    return (
        <Page>
            <TopBar hasBackButton={false} title='Permaweb Image Classifier'>
                <IconButton onClick={handleAccount}>
                    {wallet ? <Person/> : <PersonOutline/>}
                </IconButton>
            </TopBar>
            <Container className={styles.container}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography>
                            Use an existing model
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ModelList title="My Models" models={models}/>
                    </Grid>
                    <Grid item xs={12}>
                        <ModelList disabled={!wallet} title="Community Models" models={communityModels}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>OR</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <StyledButton onClick={handleAdd} aria-label="add" startIcon={<Add/>}>Create a new model</StyledButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Button size='small' color='primary' onClick={handleIntro}>Show introduction again</Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default connect(
    state => ({models: state.models}),
    null
)(Home)
