import React from 'react';
import ModelListItem from 'components/Model/ModelListItem/ModelListItem';
import { T_MODEL_ITEM } from 'types';
import PropTypes from 'prop-types';

const ModelList = ({models}) => {
    const items = models.map(modelItem => <ModelListItem key={modelItem.id} modelItem={modelItem} />);
    return items;
};

ModelList.propTypes = {
    models: PropTypes.arrayOf(T_MODEL_ITEM).isRequired
};

export default ModelList;
