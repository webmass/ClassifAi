import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

const StyledTextField = withStyles({
    root: {
        color: 'white',
        borderColor: 'white',
        '& label, & button, & input, & .MuiIconButton-label, textarea': {
            color: 'white',
        },
        '& .Mui-disabled': {
            '& .MuiIconButton-label': {
                color: 'grey'
            }
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
        },
    },
})(({ classes, color, ...other }) => (
    <TextField className={classes.root} {...other} />
));
export default StyledTextField;
