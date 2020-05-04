import {
    DB_DATASETS,
    DB_EXAMPLE_MODEL,
    DB_MODELS,
    DB_NAME,
    DB_SETTINGS,
    DB_OBJECT_STORES,
    DB_VERSION, DB_EXAMPLE_ADDED_SETTING
} from 'app/constants';

class Database {
    static DB;

    static init() {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const upgradeDb = event.target.result;
            DB_OBJECT_STORES.forEach(config => Database.createObjectStoreIfNotExist(upgradeDb, config.name, config.keyPath, config.autoIncrement));
        };
        return new Promise((resolve, reject) => {
            request.onsuccess = async e => {
                Database.DB = request.result;
                await this.initExampleModel();
                resolve();
            };
            request.onerror = async e => reject(e);
        });
    }

    static async initExampleModel() {
        const exampleAdded = await this.getSettingItem(DB_EXAMPLE_ADDED_SETTING);
        if(!exampleAdded){
            await this.saveModelItem(DB_EXAMPLE_MODEL);
            await this.saveSettingItem({name: DB_EXAMPLE_ADDED_SETTING, value: true});
        }
    }

    static createObjectStoreIfNotExist(upgradeDb, name, keyPath = 'id', autoIncrement = true) {
        if (!upgradeDb.objectStoreNames.contains(name)) {
            upgradeDb.createObjectStore(name, {keyPath, autoIncrement});
        }
    };

    static saveItem(storeObjectName, data) {
        const transaction = Database.DB.transaction(storeObjectName, 'readwrite');
        const objectStore = transaction.objectStore(storeObjectName);
        const now = Date.now();
        const dates = {updatedAt: now};
        if(!data.createdAt) dates.createdAt = now;
        const dataWithDate = {...data, ...dates};
        const request = objectStore.put(dataWithDate);
        return new Promise((resolve, reject) => {
            request.onsuccess = e => resolve({...dataWithDate, id: e.target.result});
            request.onerror = e => reject(e);
        });
    };

    static removeItem(storeObjectName, key) {
        const transaction = Database.DB.transaction(storeObjectName, 'readwrite');
        const objectStore = transaction.objectStore(storeObjectName);
        const request = objectStore.delete(key);
        return new Promise((resolve, reject) => {
            request.onsuccess = e => resolve(null);
            request.onerror = e => reject(e);
        });
    };

    static getItem(storeObjectName, key) {
        const transaction = Database.DB.transaction(storeObjectName, 'readwrite');
        const objectStore = transaction.objectStore(storeObjectName);
        const request = objectStore.get(key);
        return new Promise((resolve, reject) => {
            request.onsuccess = e => resolve(e.target.result);
            request.onerror = e => resolve(null);
        });
    };

    static getAll(storeObjectName, query = null, count = null) {
        const transaction = Database.DB.transaction(storeObjectName, 'readwrite');
        const objectStore = transaction.objectStore(storeObjectName);
        const request = objectStore.getAll(query, count);
        return new Promise((resolve, reject) => {
            request.onsuccess = e => resolve(e.target.result);
            request.onerror = e => resolve(null);
        });
    };

    static getSettings = () => Database.getAll(DB_SETTINGS);
    static getSettingItem = key => Database.getItem(DB_SETTINGS, key);
    static saveSettingItem = data => Database.saveItem(DB_SETTINGS, data);
    static removeSettingItem = key => Database.removeItem(DB_SETTINGS, key);

    static getModels = () => Database.getAll(DB_MODELS);
    static getModelItem = key => Database.getItem(DB_MODELS, parseInt(key));
    static saveModelItem = data => Database.saveItem(DB_MODELS, data);
    static removeModelItem = key => Database.removeItem(DB_MODELS, parseInt(key));

    static getModelDatasets = () => Database.getAll(DB_DATASETS);
    static getModelDatasetItem = key => Database.getItem(DB_DATASETS, parseInt(key));
    static saveModelDatasetItem = data => Database.saveItem(DB_DATASETS, data);
    static removeModelDatasetItem = key => Database.removeItem(DB_DATASETS, parseInt(key));
};

export default Database;
