import React from 'react';
import ModelListItem from 'components/Model/ModelListItem/ModelListItem';
import { T_MODELS } from 'types';

const ModelList = ({models}) => {
    const items = models.map(modelItem => <ModelListItem key={modelItem.id} modelItem={modelItem} />);
    return items;
};

ModelList.propTypes = {
    models: T_MODELS.isRequired
};

export default ModelList;
