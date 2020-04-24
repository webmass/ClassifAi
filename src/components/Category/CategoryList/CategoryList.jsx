import React from 'react';
import {List, ListItem} from '@material-ui/core';

const CategoryList = ({ categories }) => {
    const listItems = categories.map(category => <ListItem key={category}>- {category}</ListItem>);

    return (
        <List dense={true}>
            {listItems}
        </List>
    )
};

export default CategoryList;
