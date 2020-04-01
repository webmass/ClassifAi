import React from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Container } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import Page from 'components/Page/Page';
import styles from './Home.module.scss';
import { ROUTES } from 'app/constants';
import ModelList from 'components/Model/ModelList/ModelList';
import StyledButton from 'components/StyledButton/StyledButton';

const Home = () => {
    let history = useHistory();

    const handleAdd = () => history.push(ROUTES.MODEL_FORM);

    return (
        <Page>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Permaweb Image Classifier
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container className={styles.container}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography>
                            Use an existing model
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ModelList/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>OR</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <StyledButton onClick={handleAdd} aria-label="add" startIcon={<Add/>}>Create a new model</StyledButton>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Home;
