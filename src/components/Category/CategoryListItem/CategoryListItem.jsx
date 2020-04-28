import React, { useContext, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import StyledTextField from 'components/StyledTextField/StyledTextField';
import ModelContext from 'components/Model/ModelContext';

const CategoryListItem = ({category}) => {
    const {modelItem, setModelItem, renamedCategories, setRenamedCategories} = useContext(ModelContext);
    const [isEdit, setIsEdit] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState(category);
    const [hasError, setHasError] = useState(false);

    const handleChange = (event) => {
        const value = event.target.value.trim();
        const hasCategoryWithSameName = !!modelItem.categories
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
        const categories = [...modelItem.categories];
        if(category !== newCategoryName){
            const renamed = {...renamedCategories, [category] : newCategoryName};
            setRenamedCategories(renamed);
        }
        if(newCategoryName){
            const editedCategoryIndex = categories.indexOf(category);
            categories[editedCategoryIndex] = newCategoryName;
            setModelItem({...modelItem, categories});
        } else {
            setModelItem({...modelItem, categories: categories.filter(c => c !== category)});
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

export default CategoryListItem;
