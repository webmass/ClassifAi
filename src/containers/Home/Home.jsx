import React, { useContext, useEffect } from 'react';
import { Typography, Grid, Container } from '@material-ui/core';
import { Add, ArrowRight, Person, PersonOutline } from '@material-ui/icons';
import Page from 'components/Page/Page';
import styles from './Home.module.scss';
import { APP_NAME, DB_INTRO_DONE_SETTING, ROUTES } from 'app/constants';
import StyledButton from 'components/StyledButton/StyledButton';
import AppContext from 'app/AppContext';
import { connect } from 'react-redux';
import TopBar from 'components/TopBar/TopBar';
import IconButton from '@material-ui/core/IconButton';
import DialogService from 'services/DialogService';
import Button from '@material-ui/core/Button';
import Database from 'services/Database';
import { updateLastSearchValue } from 'store/slices/searchSlice';
import useRouting from 'hooks/useRouting';

const Home = ({updateLastSearchValue, lastSearchValue}) => {
    const {wallet} = useContext(AppContext);
    const routing = useRouting();
    const handleAdd = () => routing.push(ROUTES.MODEL_FORM);

    const handleAccount = () => routing.push(ROUTES.ACCOUNT);
    const handleIntro = () => {
        DialogService.showIntro();
        Database.saveSettingItem({name: DB_INTRO_DONE_SETTING, value: true});
    };

    const handleMyModels = () => routing.push(ROUTES.SEARCH_LOCAL);
    const handleCommunityModels = () => routing.push(ROUTES.SEARCH_COMMUNITY);

    useEffect(() => {
        if(lastSearchValue) updateLastSearchValue('');
    }, [updateLastSearchValue, lastSearchValue]);

    useEffect(() => {
        Database.getSettingItem(DB_INTRO_DONE_SETTING)
            .then(result => !result ? handleIntro() : null)
            .catch();
    }, []);

    return (
        <Page addTopBarPadding={false} isCentered={true}>
            <TopBar hasBackButton={false} title={APP_NAME} titleAlign='center'>
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
    state => ({models: state.models, lastSearchValue: state.lastSearchValue}),
    {updateLastSearchValue}
)(Home)
