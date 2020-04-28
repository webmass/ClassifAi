import ArweaveService from 'services/ArweaveService';
import Database from 'services/Database';
import TensorFlowService from 'services/TensorFlowService';

class ModelService {
    static isCommunityId = (id) => !id.toString().match(/^\d+$/);
    static getModelItem = (id) => {
        const isCommunityModel = this.isCommunityId(id);
        const getterService = isCommunityModel ? ArweaveService : Database;
        return getterService.getModelItem(id);
    };
    static getModelDatasetItem = (modelId) => {
        const isCommunityModel = this.isCommunityId(modelId);
        const getterService = isCommunityModel ? ArweaveService : Database;
        return getterService.getModelDatasetItem(modelId);
    };
    static saveCommunityDatasetToLocal = async (communityModelId, modelId) => {
        const datasetItem = await ArweaveService.getModelDatasetItem(communityModelId);
        await Database.saveModelDatasetItem({modelId, data: datasetItem.data});
    };
    static renameModelDatasetCategories = async (id, renamedCategories) => {
        const dataset = await Database.getModelDatasetItem(id);
        if(!dataset) return;
        let nbTrainingsUpdateNeeded = false;
        Object.keys(renamedCategories)
            .forEach(oldName => {
                const newName = renamedCategories[oldName];
                if(newName) dataset.data[newName] = [...dataset.data[oldName]];
                else nbTrainingsUpdateNeeded = true;
                delete dataset.data[oldName];
            });
        await Database.saveModelDatasetItem(dataset);
        return {nbTrainingsUpdateNeeded};
    };
    static updatenbTrainings = async (modelItem, updateModelItem) => {
        const datasetItem = await Database.getModelDatasetItem(modelItem.id);
        TensorFlowService.clear();
        TensorFlowService.setKnnDataset(datasetItem.data);
        const nbTrainings = TensorFlowService.getNbTrainings();
        const updated = {...modelItem, nbTrainings};
        updateModelItem(updated);
        await Database.saveModelItem(updated);
        return updated;
    };
}

export default ModelService;
