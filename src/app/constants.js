// ROUTES
export const ROUTES = {
    HOME: '/home',
    MODEL_DETAILS: '/model_details',
    MODEL_FORM: '/model_form',
    ACCOUNT: '/account',
    SEARCH: '/search'
};
export const SEARCH_TYPES = {
    key: 'searchType',
    myModels: 'myModels',
    community: 'community'
};
// DB
export const DB_NAME = 'permaweb-image-classifier';
export const DB_VERSION = 2;
export const DB_SETTINGS = 'SETTINGS';
export const DB_MODELS = 'MODELS';
export const DB_DATASETS = 'DATASETS';
export const DB_EXAMPLE_MODEL = {
    id: 1, name: 'Example : Thumbs', description: 'Up Or Down ?', categories: [
        '👍', 'neutral', '👎'
    ]
};
export const DB_OBJECT_STORES = [
    {name: DB_SETTINGS, keyPath: 'name', autoIncrement: false},
    {name: DB_MODELS, keyPath: 'id', autoIncrement: true},
    {name: DB_DATASETS, keyPath: 'modelId', autoIncrement: false}
];
export const DB_INTRO_DONE_SETTING = 'introDone';
export const DB_EXAMPLE_ADDED_SETTING = 'exampleAdded';
// Arweave
export const AR_DEFAULT_TAG = {name: 'webmass-app-name', value: 'permaweb-image-classifier--'};
export const AR_MODEL_TAG_NAME = 'is-model';
export const AR_MODEL_DATASET_TAG_NAME = 'is-model-dataset';
export const AR_MODEL_NAME_TAG_NAME = 'model-name';
export const AR_MODEL_DESCRIPTION_TAG_NAME = 'model-description';
export const AR_MODEL_TRANSACTION_ID_TAG_NAME = 'model-transaction-id';
