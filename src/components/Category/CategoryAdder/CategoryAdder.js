import InputAdornment from '@material-ui/core/InputAdornment';
import { Add } from '@material-ui/icons';
import StyledTextField from 'components/StyledTextField/StyledTextField';
import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';

const CategoryAdder = ({categories, updateCategories}) => {
    const [hasCategoryError, setHasCategoryError] = useState(false);
    const [canAdd, setCanAdd] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = () => {
        if(!canAdd) return;
        const newCategoryTrimmed = newCategory.trim();
        updateCategories([...categories, newCategoryTrimmed]);
        setNewCategory('');
    };

    const handleCategoryEnter = (event) => {
        if (event.key === 'Enter') handleAdd();
    };

    const handleChange = (setter, event) => {
        setter(event.target.value);
        if (categories.find(category => category === event.target.value.trim())) {
            setHasCategoryError(true);
            return;
        }
        setHasCategoryError(false);
    };

    useEffect(() => setCanAdd(newCategory.trim() && !hasCategoryError), [newCategory, categories, hasCategoryError]);

    return (
        <StyledTextField
            value={newCategory}
            error={hasCategoryError}
            helperText={hasCategoryError ? 'This category already exists' : null}
            label="New category"
            variant="outlined"
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    <IconButton
                        disabled={!canAdd}
                        aria-label="Add"
                        edge="end"
                        onClick={handleAdd}
                    >
                        <Add/>
                    </IconButton>
                </InputAdornment>,
            }}
            onKeyPress={e => handleCategoryEnter(e)}
            onChange={e => handleChange(setNewCategory, e)}/>
    )
};

export default CategoryAdder;
