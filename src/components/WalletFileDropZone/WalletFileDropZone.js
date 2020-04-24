import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from 'app/AppContext';
import ArweaveService from 'services/ArweaveService';
import Database from 'services/Database';
import { DB_SETTINGS } from 'app/constants';
import { Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import styles from './WalletFileDropZone.module.scss';
import LottieAnimation from 'components/LottieAnimation/LottieAnimation';
import DialogService from 'services/DialogService';
import { goHome } from 'services/RoutingService';

const WalletFileDropZone = () => {
    const history = useHistory();
    const appContext = useContext(AppContext);
    const [wallet, setWallet] = useState(appContext.wallet);
    const [hasSuccess, setHasSuccess] = useState(false);

    const parseWalletFile = async (e) => {
        try {
            const jwk = JSON.parse(e.target.result);
            const myWallet = await ArweaveService.createMyWallet(jwk);
            setWallet(myWallet);
            await Database.saveItem(DB_SETTINGS, {name: 'wallet', ...myWallet});
            setHasSuccess(true);
        } catch (err) {
            DialogService.showError('Invalid Keyfile');
        }
    };

    const handleComplete = () => {
        appContext.setWallet(wallet);
        goHome(history);
    };

    const handleFileInput = async (files) => {
        if (!files || !files[0]) return;
        const fr = new FileReader();
        fr.onload = parseWalletFile;
        fr.readAsText(files[0]);
    };

    if(hasSuccess){
        return (
            <div>
                <Typography variant='h4' gutterBottom={true}>
                    Logged in !
                </Typography>
                <LottieAnimation animationName='unlocked' height={150} width={150} loop={false} onComplete={handleComplete} />
            </div>
        );
    }

    return (
        <div align='center'>
            <div className={styles.arweaveDropZone}>
                <input className={styles.arweaveKeyfile} type="file" onChange={(e) => handleFileInput(e.target.files)}/>
                <Typography align='center' variant='body1' className={styles.text}>
                    {
                        wallet ?
                            'You are already logged in, drop a keyfile to change account' :
                            'You can unlock the community feature by logging in with an Arweave keyfile that you can drop here.'
                    }
                </Typography>
            </div>
            <Typography variant='body1' className={styles.text}>
                Don't have an Arweave keyfile ?
            </Typography>
            <Typography variant='body1' className={styles.text}>
                Visit <Link href="https://www.arweave.org/" target="_blank">www.arweave.org</Link>
            </Typography>
        </div>
    );
};

export default WalletFileDropZone;
