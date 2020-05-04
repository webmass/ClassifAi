import Database from 'services/Database';
import { useDispatch, useSelector } from 'react-redux';
import { updateModelItem, updateModels, removeModelItem, addModelItem } from 'store/slices/modelsSlice';
import { updateCommunityModels } from 'store/slices/communityModelsSlice';
import ModelService from 'services/ModelService';
import { useEffect, useMemo } from 'react';

const useModelItem = (id) => {
    const dispatch = useDispatch();
    const isCommunityModel = useMemo(() => ModelService.isCommunityId(id), [id]);
    const modelType = useMemo(() => isCommunityModel ? 'communityModels' : 'models', [isCommunityModel]);
    const models = useSelector(state => state[modelType]);
    const updates = useMemo(() => ({
        communityModels: updateCommunityModels,
        models: updateModels,
    }), []);

    const getModelItem = () => {
        return models.find(model => model.id === (isCommunityModel ? id : parseInt(id))) || {};
    };

    const modelItem = id ? getModelItem() : {};

    const ref = {
        isLoading: !modelItem.id,
        hasError: false,
        modelItem,
        saveModelItem: async value => {
            const savedModel = await Database.saveModelItem(value);
            const isALocalUpdate = id && !isCommunityModel;
            dispatch(isALocalUpdate ? updateModelItem(savedModel) : addModelItem(savedModel));
            return savedModel;
        },
        removeModelItem: async () => {
            const intId = parseInt(id);
            await Database.removeModelItem(intId)
                .then(() => {
                    Database.removeModelDatasetItem(intId);
                    dispatch(removeModelItem(intId));
                })
                .catch()
        }
    };

    useEffect(() => {
        if (id && isCommunityModel && !ref.modelItem.id) {
            ModelService.getModelItem(id)
                .then(result => result ? dispatch(updates[modelType]([...models, result])) : null)
                .finally(() => ref.isLoading = false)
                .catch(() => ref.hasError = true)
        }
    }, [id, dispatch, modelType, models, updates, isCommunityModel, ref.modelItem.id, ref.isLoading, ref.hasError]);

    return ref;
};

export default useModelItem;
