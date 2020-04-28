import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';

const StyledTextField = withStyles({
    root: {
        color: 'white',
        borderColor: 'white',
        '& .Mui-disabled': {
            '& .MuiIconButton-label': {
                color: 'grey'
            }
        },
        '& .MuiOutlinedInput-root, & .MuiOutlinedInput-root:hover': {
            '& fieldset': {
                borderColor: 'white',
            },
        },
    },
    input: {
        color: 'white'
    }
})(({ classes, InputProps = {}, ...other }) => (
    <TextField style={{color: 'white'}} className={classes.root} {...other} InputProps={{
        className: classes.input, ...InputProps
    }}/>
));
export default StyledTextField;
