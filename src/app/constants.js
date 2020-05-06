// ROUTES
export const SEARCH = {
    BASE: 'search',
    KEY: 'searchType',
    LOCAL: 'myModels',
    COMMUNITY: 'community'
};
export const ROUTES = {
    HOME: '/home',
    MODEL_DETAILS: '/model_details',
    MODEL_FORM: '/model_form',
    ACCOUNT: '/account',
    SEARCH_LOCAL: `/${SEARCH.BASE}/${SEARCH.LOCAL}`,
    SEARCH_COMMUNITY: `/${SEARCH.BASE}/${SEARCH.COMMUNITY}`,
};
// DB
export const DB_NAME = 'permaweb-image-classifier';
export const DB_VERSION = 2;
export const DB_SETTINGS = 'SETTINGS';
export const DB_MODELS = 'MODELS';
export const DB_DATASETS = 'DATASETS';
export const DB_EXAMPLE_MODEL = {
    id: 1, name: 'Example : Thumbs', description: 'Up Or Down ?', nbTrainings: 0, categories: [
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
export const AR_MIN_TRAINING_REQUIRED = 100;
export const AR_APP_NAME = 'ClassifAi';
export const AR_APP_VERSION = '0';
export const AR_APP_NAME_TAG = {name: 'App-Name', value: AR_APP_NAME};
export const AR_APP_VERSION_TAG = {name: 'App-Version', value: AR_APP_VERSION};
export const AR_DEFAULT_TAGS = [
    AR_APP_NAME_TAG,
    AR_APP_VERSION_TAG,
];
export const AR_MODEL_TAG_NAME = AR_APP_NAME + '-is-model';
export const AR_MODEL_DATASET_TAG_NAME = AR_APP_NAME + '-is-model-dataset';
export const AR_MODEL_NAME_TAG_NAME = AR_APP_NAME + '-model-name';
export const AR_MODEL_DESCRIPTION_TAG_NAME = AR_APP_NAME + '-model-description';
export const AR_MODEL_DATASET_ID_TAG_NAME = AR_APP_NAME + '-model-dataset-transaction-id';
export const AR_CHUNK_INDEX_TAG_NAME = AR_APP_NAME + '-chunk-index';
export const AR_YEAR_TAG_NAME = AR_APP_NAME + '-publication-year';
export const AR_NAME_SEARCH_TAG_NAME = AR_APP_NAME + '-name-search-';
export const AR_FROM_TAG_NAME = AR_APP_NAME + '-from';
export const AR_WORD_TAG_NAME = AR_APP_NAME + '-model-name-word';
