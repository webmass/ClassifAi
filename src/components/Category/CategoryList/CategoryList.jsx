import React from 'react';
import {List, ListItem} from '@material-ui/core';
import CategoryListItem from 'components/Category/CategoryListItem/CategoryListItem';
import { T_CATEGORIES } from 'types';

const CategoryList = ({ categories }) => {
    const listItems = categories.map(category => {
        return (
            <ListItem key={category}>
                <CategoryListItem category={category}/>
            </ListItem>
        )
    });

    return (
        <List dense={true}>
            {listItems}
        </List>
    )
};

CategoryList.propTypes = {
    categories: T_CATEGORIES.isRequired
};

export default CategoryList;
