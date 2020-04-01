import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { goBack } from 'services/RoutingService';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    titleWrapper: {
        flexGrow: 1,
        overflow: 'hidden'
    },
    title: {
        textAlign: 'left',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
}));

const TopBar = ({title, children, hasBackButton = true}) => {
    let history = useHistory();
    const classes = useStyles();

    const handleBack = () => goBack(history);

    const backButton = hasBackButton ? <IconButton onClick={handleBack}><ArrowBack/></IconButton> : null;

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {backButton}
                    <span className={classes.titleWrapper}>
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                    </span>
                    <span>{children}</span>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default TopBar;
