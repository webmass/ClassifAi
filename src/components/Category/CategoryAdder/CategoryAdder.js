import InputAdornment from '@material-ui/core/InputAdornment';
import { Add } from '@material-ui/icons';
import StyledTextField from 'components/StyledTextField/StyledTextField';
import React, { useContext, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ModelContext from 'components/Model/ModelContext';

const CategoryAdder = () => {
    const {modelItem, setModelItem} = useContext(ModelContext);
    const [hasCategoryError, setHasCategoryError] = useState(false);
    const [canAdd, setCanAdd] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const categories = modelItem.categories;

    const scrollIntoView = (event) => event.target.scrollIntoView();

    const handleAdd = (event) => {
        if(!canAdd) return;
        const newCategoryTrimmed = newCategory.trim();
        setModelItem({...modelItem, categories: [...categories, newCategoryTrimmed]});
        setNewCategory('');
        scrollIntoView(event);
    };

    const handleCategoryEnter = (event) => {
        if (event.key === 'Enter') handleAdd(event);
    };

    const handleChange = (setter, event) => {
        setter(event.target.value);
        if (categories.find(category => category.toLowerCase() === event.target.value.toLowerCase().trim())) {
            setHasCategoryError(true);
            return;
        }
        setHasCategoryError(false);
    };

    useEffect(() => setCanAdd(newCategory.trim() && !hasCategoryError), [newCategory, categories, hasCategoryError]);

    return (
        <StyledTextField
            onFocus={scrollIntoView}
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
