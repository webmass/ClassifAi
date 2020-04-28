import React from 'react';
import {List, ListItem} from '@material-ui/core';
import CategoryListItem from 'components/Category/CategoryListItem/CategoryListItem';
import PropTypes from 'prop-types';

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
    categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default CategoryList;
