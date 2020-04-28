import React, { useContext, useEffect } from 'react';
import { Typography, Grid, Container } from '@material-ui/core';
import { Add, ArrowRight, Person, PersonOutline } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Page from 'components/Page/Page';
import styles from './Home.module.scss';
import { DB_INTRO_DONE_SETTING, ROUTES, SEARCH_TYPES } from 'app/constants';
import StyledButton from 'components/StyledButton/StyledButton';
import AppContext from 'app/AppContext';
import { connect } from 'react-redux';
import TopBar from 'components/TopBar/TopBar';
import IconButton from '@material-ui/core/IconButton';
import { goToAccount } from 'services/RoutingService';
import DialogService from 'services/DialogService';
import Button from '@material-ui/core/Button';
import Database from 'services/Database';
import { updateLastSearchValue } from 'store/slices/searchSlice';

const Home = ({updateLastSearchValue}) => {
    const {wallet} = useContext(AppContext);
    let history = useHistory();
    const handleAdd = () => history.push(ROUTES.MODEL_FORM);

    const handleAccount = () => goToAccount(history);
    const handleIntro = () => {
        DialogService.showIntro();
        Database.saveSettingItem({name: DB_INTRO_DONE_SETTING, value: true});
    };

    const handleMyModels = () => history.push(`${ROUTES.SEARCH}/${SEARCH_TYPES.myModels}`);
    const handleCommunityModels = () => history.push(`${ROUTES.SEARCH}/${SEARCH_TYPES.community}`);

    useEffect(() => {
        updateLastSearchValue('');
        Database.getSettingItem(DB_INTRO_DONE_SETTING)
            .then(result => !result ? handleIntro() : null)
            .catch();
    }, [updateLastSearchValue]);

    return (
        <Page hasTopBar={true}>
            <TopBar hasBackButton={false} title='Permaweb Image Classifier'>
                <IconButton onClick={handleAccount}>
                    {wallet ? <Person/> : <PersonOutline/>}
                </IconButton>
            </TopBar>
            <Container className={styles.container}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography>
                            Use an existing model from :
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button color="primary" onClick={handleMyModels} className={styles.modelButton}>
                            my models<ArrowRight className={styles.modelButtonIcon}/>
                        </Button>
                    </Grid>
                    {
                        wallet ?
                            <Grid item xs={12}>
                                <Button color="primary" onClick={handleCommunityModels} className={styles.modelButton}>
                                    Community models<ArrowRight className={styles.modelButtonIcon}/>
                                </Button>
                            </Grid>
                            : null
                    }
                    <Grid item xs={12}>
                        <Typography>OR</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <StyledButton onClick={handleAdd} aria-label="add" startIcon={<Add/>}>Create a new
                            model</StyledButton>
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
    {updateLastSearchValue}
)(Home)
