import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Page from 'components/Page/Page';
import TopBar from 'components/TopBar/TopBar';
import WalletFileDropZone from 'components/WalletFileDropZone/WalletFileDropZone';
import AppContext from 'app/AppContext';
import StyledButton from 'components/StyledButton/StyledButton';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import styles from './Account.module.scss';
import Database from 'services/Database';
import { DB_SETTINGS } from 'app/constants';
import { goHome } from 'services/RoutingService';
import { ExitToApp } from '@material-ui/icons';

const Account = () => {
    const history = useHistory();
    const {wallet, setWallet} = useContext(AppContext);

    const handleLogOut = async () => {
        await Database.removeItem(DB_SETTINGS, 'wallet');
        setWallet(null);
        goHome(history);
    };

    return (
        <Page addTopBarPadding={true}>
            <TopBar title='Log In / out'/>
            <Container className={styles.container}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <WalletFileDropZone/>
                    </Grid>
                    <Grid item xs={12}>
                        {wallet ? <StyledButton onClick={handleLogOut} endIcon={<ExitToApp/>}>log out</StyledButton> : null}
                    </Grid>
                </Grid>
            </Container>
        </Page>
    )
};

export default Account;
