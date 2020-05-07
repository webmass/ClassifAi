import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';
import { T_CHILDREN } from 'app-prop-types';
import useRouting from 'hooks/useRouting';

const useStyles = (titleAlign) => makeStyles(() => ({
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
        textAlign: titleAlign,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
}));

const TopBar = ({title, titleAlign = 'left', position = 'fixed', children, hasBackButton = true, isBackToHome = false, backPath}) => {
    const routing = useRouting();
    const classes = useStyles(titleAlign)();

    const handleBack = () => {
        if (backPath) routing.push(backPath);
        else {
            isBackToHome ? routing.goHome() : routing.goBack();
        }
    };

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

TopBar.propTypes = {
    title: PropTypes.string,
    titleAlign: PropTypes.string,
    position: PropTypes.oneOf(['absolute', 'fixed', 'relative', 'static', 'sticky']),
    hasBackButton: PropTypes.bool,
    children: T_CHILDREN,
};

export default TopBar;
