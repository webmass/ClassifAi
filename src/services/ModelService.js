import ArweaveService from 'services/ArweaveService';
import Database from 'services/Database';
import TensorFlowService from 'services/TensorFlowService';

class ModelService {
    static isCommunityId = (id) => {
        if(!id) return null;
        return !id.toString().match(/^\d+$/);
    };
    static getModelItem = (id) => {
        const isCommunityModel = this.isCommunityId(id);
        const getterService = isCommunityModel ? ArweaveService : Database;
        return getterService.getModelItem(id);
    };
    static getModelDatasetItem = id => {
        if(this.isCommunityId(id)){
            return ArweaveService.getModelDatasetItem(id);
        } else {
            return Database.getModelDatasetItem(id);
        }
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
    static getUpdatedNbTrainings = async (modelItem) => {
        const datasetItem = await Database.getModelDatasetItem(modelItem.id);
        TensorFlowService.clear();
        TensorFlowService.setKnnDataset(datasetItem.data);
        return TensorFlowService.getNbTrainings();
    };
    static restoreTraining = async (datasetRefId, handleRestoreSuccess, handleRestoreFailed) => {
        TensorFlowService.clear();
        ModelService.getModelDatasetItem(datasetRefId)
            .then(datasetItem => {
                if(datasetItem){
                    TensorFlowService.setKnnDataset(datasetItem.data);
                    handleRestoreSuccess(datasetItem);
                } else {
                    handleRestoreFailed();
                }
                return datasetItem;
            })
            .catch(handleRestoreFailed);
    };
}

export default ModelService;
