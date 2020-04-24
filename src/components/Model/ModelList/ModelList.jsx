import { Typography } from '@material-ui/core';
import StyledTextField from 'components/StyledTextField/StyledTextField';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getModelDetailsRoute } from 'services/RoutingService';

const ModelList = ({title, disabled, models}) => {
    const [currentModel, setCurrentModel] = useState(null);
    let history = useHistory();

    const handleModelChange = async (event, value) => {
        if (value) {
            setCurrentModel(value);
            history.push({pathname: getModelDetailsRoute(value.id), state: {details: value}});
        } else {
            setCurrentModel(null);
        }
    };

    return (<Autocomplete
        disabled={disabled}
        value={currentModel}
        options={models}
        onChange={handleModelChange}
        getOptionLabel={(option) => option.name}
        renderOption={option => (
            <div>
                <Typography variant='subtitle1' display='block' color='primary'>{option.name}</Typography>
                <Typography variant='body2' display='block'>{option.description}</Typography>
                <Typography variant='body2' display='block'>
                    <i>{option.nbTeachedImages ? `Trained with ${option.nbTeachedImages} images` : 'The model is not trained yet'}</i>
                </Typography>
            </div>)}
        renderInput={(params) => <StyledTextField {...params}
                                                  label={title} variant="outlined"/>}
    />);
};

export default ModelList;
