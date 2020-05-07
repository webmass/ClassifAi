import React, { useContext, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import StyledTextField from 'components/StyledTextField/StyledTextField';
import ModelContext from 'components/Model/ModelContext';
import { T_CATEGORY } from 'app-prop-types';

const CategoryListItem = ({category}) => {
    const {formData, setFormData, renamedCategories, setRenamedCategories} = useContext(ModelContext);
    const [isEdit, setIsEdit] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState(category);
    const [hasError, setHasError] = useState(false);

    const handleChange = (event) => {
        const value = event.target.value.trim();
        const hasCategoryWithSameName = !!formData.categories
            .find(category => value && category.toLowerCase() === value.toLowerCase());
        setHasError(hasCategoryWithSameName);
        setNewCategoryName(event.target.value);
    };

    const handleCloseEditMode = () => {
        setIsEdit(false);
        if(hasError) {
            setHasError(false);
            setNewCategoryName(category);
            return;
        }
        const categories = [...formData.categories];
        if(category !== newCategoryName){
            const renamed = {...renamedCategories, [category] : newCategoryName};
            setRenamedCategories(renamed);
        }
        if(newCategoryName){
            const editedCategoryIndex = categories.indexOf(category);
            categories[editedCategoryIndex] = newCategoryName;
            setFormData({...formData, categories});
        } else {
            setFormData({...formData, categories: categories.filter(c => c !== category)});
        }
    };
    const handleOpenEditMode = () => {
        setIsEdit(true);
    };
    const handleCategoryEnter = (event) => {
        if (event.key === 'Enter') handleCloseEditMode();
    };

    if(isEdit){
        return <StyledTextField
            autoFocus
            error={hasError}
            helperText={hasError ? 'Duplicate category name' : null}
            onChange={handleChange}
            value={newCategoryName}
            onKeyPress={handleCategoryEnter}
            onBlur={handleCloseEditMode}/>;
    } else {
        return <Typography onClick={handleOpenEditMode}>- {category}</Typography>
    }
};

CategoryListItem.propTypes = {
    category: T_CATEGORY
};

export default CategoryListItem;
