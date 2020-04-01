import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

const StyledButton = withStyles({
    root: {
        background: 'linear-gradient(45deg, #3f51b5 20%, #61dafb 80%);',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 50,
        padding: '0 25px',
        boxShadow: '0 3px 5px 2px rgba(63, 81, 181, 0.5);',
    },
    label: {
        textTransform: 'uppercase',
    },
})(({ classes, ...other }) => (
    <Button className={classes.root} {...other} />
));

export default StyledButton;
