import React from 'react';
import ModelListItem from 'components/Model/ModelListItem/ModelListItem';

const ModelList = ({models}) => {
    const items = models.map(modelItem => <ModelListItem key={modelItem.id} modelItem={modelItem} />);
    return items;
};

export default ModelList;
