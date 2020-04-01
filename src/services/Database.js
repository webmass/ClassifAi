const DB_NAME = 'permaweb-image-classifier';
const SETTINGS = 'SETTINGS';
const MODELS = 'MODELS';
const DATASETS = 'DATASETS';

const objectStoresConfig = [
    {name: SETTINGS, keyPath: 'name', autoIncrement: false},
    {name: MODELS, keyPath: 'id', autoIncrement: true},
    {name: DATASETS, keyPath: 'model_id', autoIncrement: false}
];

const EXAMPLE_MODEL = {
    id: 1, name: 'Example : Thumbs', description: 'Up Or Down ?', categories: [
        '👍', 'neutral', '👎'
    ]
};

class Database {
    static DB;

    static init() {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            const upgradeDb = event.target.result;
            objectStoresConfig.forEach(config => Database.createObjectStoreIfNotExist(upgradeDb, config.name, config.keyPath, config.autoIncrement));
        };
        return new Promise((resolve, reject) => {
            request.onsuccess = async e => {
                resolve(Database.DB = request.result);
                await this.initExampleModel();
            };
            request.onerror = async e => reject(e);
        });
    }

    static async initExampleModel() {
        const exampleAdded = await this.getItem(SETTINGS, 'exampleAdded');
        if(!exampleAdded){
            await this.saveModelItem(EXAMPLE_MODEL);
            await this.saveItem(SETTINGS, {name: 'exampleAdded', value: true});
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
        const request = objectStore.put(data);
        return new Promise((resolve, reject) => {
            request.onsuccess = e => resolve({...data, id: e.target.result});
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

    static getModels = () => Database.getAll(MODELS);
    static getModelItem = key => Database.getItem(MODELS, parseInt(key));
    static saveModelItem = data => Database.saveItem(MODELS, data);
    static removeModelItem = key => Database.removeItem(MODELS, parseInt(key));

    static getModelDatasets = () => Database.getAll(DATASETS);
    static getModelDatasetItem = key => Database.getItem(DATASETS, parseInt(key));
    static saveModelDatasetItem = data => Database.saveItem(DATASETS, data);
    static removeModelDatasetItem = key => Database.removeItem(DATASETS, parseInt(key));
};

export default Database;
