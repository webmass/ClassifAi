import Database from 'services/Database';
import { useDispatch, useSelector } from 'react-redux';
import { updateModelItem, updateModels, removeModelItem, addModelItem } from 'store/slices/modelsSlice';
import { updateCommunityModels } from 'store/slices/communityModelsSlice';
import ModelService from 'services/ModelService';
import { useCallback, useEffect, useMemo } from 'react';
import useRouting from 'hooks/useRouting';
import DialogService from 'services/DialogService';

const useModelItem = (id) => {
    const dispatch = useDispatch();
    const routing = useRouting();
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

    const showError = useCallback(message => {
        routing.goBack();
        DialogService.showError(message);
    }, [routing]);

    const usedModel = {
        isLoading: !modelItem.id,
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
                    return dispatch(removeModelItem(intId));
                })
                .catch(() => showError('Delete failed'))
        }
    };

    useEffect(() => {
        if (id && !modelItem.id) {
            ModelService.getModelItem(id)
                .then(result => result ? dispatch(updates[modelType]([...models, result])) : showError('Model not found'))
                .catch(e => showError(e.message));
        }
    }, [id, dispatch, modelType, models, updates, modelItem.id, showError]);

    return usedModel;
};

export default useModelItem;
