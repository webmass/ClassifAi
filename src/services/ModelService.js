import ArweaveService from 'services/ArweaveService';
import Database from 'services/Database';

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
    static getNbTeachedImages = (modelId) => {

    }
}

export default ModelService;
