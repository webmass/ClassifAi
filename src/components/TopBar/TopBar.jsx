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
    bar: {
        minHeight: 56,
        height: 56
    },
    titleWrapper: {
        flexGrow: 1,
        marginLeft: 20,
        overflow: 'hidden'
    },
    title: {
        textAlign: 'left',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
}));

const TopBar = ({title, position = 'fixed', children, hasBackButton = true}) => {
    let history = useHistory();
    const classes = useStyles();

    const handleBack = () => goBack(history);

    const backButton = hasBackButton ? <IconButton onClick={handleBack}><ArrowBack/></IconButton> : null;

    return (
        <div className={classes.root}>
            <AppBar position={position} className={classes.bar}>
                <Toolbar disableGutters={true} className={classes.bar}>
                    {backButton}
                    {
                        title ?
                            <span className={classes.titleWrapper}>
                                <Typography variant="h6" className={classes.title}>
                                    {title}
                                </Typography>
                            </span>
                            : null
                    }
                    {children}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default TopBar;
