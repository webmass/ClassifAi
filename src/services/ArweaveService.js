import Arweave from 'arweave/web';

import {
    AR_CHUNK_INDEX_TAG_NAME,
    AR_MODEL_DATASET_ID_TAG_NAME,
    AR_MODEL_DATASET_TAG_NAME,
    AR_MODEL_DESCRIPTION_TAG_NAME,
    AR_MODEL_NAME_TAG_NAME,
    AR_MODEL_TAG_NAME,
    DB_SETTINGS,
    AR_YEAR_TAG_NAME,
    AR_NAME_SEARCH_TAG_NAME,
    AR_DEFAULT_TAGS,
    AR_APP_VERSION_TAG,
    AR_APP_NAME_TAG, AR_FROM_TAG_NAME, AR_WORD_TAG_NAME
} from 'app/constants';
import Database from 'services/Database';

class ArweaveService {
    static #jwk;
    static #address;
    static #arweave;

    static init = async () => {
        this.#arweave = Arweave.init({
            protocol: 'https',
            host: 'arweave.net',
            port: 443,
            timeout: 500000,
        });
        const wallet = await Database.getItem(DB_SETTINGS, 'wallet');
        if (wallet) {
            this.#jwk = wallet.jwk;
            this.#address = wallet.address;
        }
        return wallet;
    };

    static createMyWallet = async jwk => {
        const address = await this.#arweave.wallets.jwkToAddress(jwk);
        this.#jwk = jwk;
        this.#address = address;
        return {
            jwk, address
        };
    };

    static signAndPost = async (payload, tags, last_tx = null, nbAttempts = 0) => {
        const maxAttempts = 50;
        const transaction = await this.generateSignedTransaction(payload, tags, last_tx);
        const transactionResult = await this.postTransaction(transaction);
        if (this.hasError(transactionResult) && nbAttempts < maxAttempts) {
            return await this.signAndPost(payload, tags, last_tx, ++nbAttempts);
        }
        return {transaction, transactionResult};
    };

    static postTransaction = async (transaction) => {
        return this.#arweave.transactions.post(transaction);
    };

    static publishDataset = async (modelItem, dataset, publicationTime) => {
        const chunkMaxSize = 250000;
        const datasetPayload = {
            publicationTime,
            data: dataset
        };
        const datasetTags = [{name: AR_MODEL_DATASET_TAG_NAME, value: 'true'}];
        const refTransaction = await this.generateSignedTransaction(datasetPayload, datasetTags);
        const datasetRefId = refTransaction.id;
        const stringPayload = JSON.stringify(datasetPayload);
        const payloadLength = stringPayload.length;
        let last_tx = null;
        const nbChunks = Math.ceil(payloadLength / chunkMaxSize);
        for (let i = 0; i * chunkMaxSize < payloadLength; i++) {
            const chunk = stringPayload.substring(i * chunkMaxSize, (i + 1) * chunkMaxSize);
            const chunkPayload = {chunkIndex: i, chunk};
            const chunkTags = [
                ...datasetTags,
                {name: AR_CHUNK_INDEX_TAG_NAME, value: i.toString()},
                {name: AR_MODEL_DATASET_ID_TAG_NAME, value: datasetRefId}
            ];
            const {transaction, transactionResult} = await this.signAndPost(chunkPayload, chunkTags, last_tx);
            if (this.hasError(transactionResult)) return {
                datasetResult: transactionResult,
                datasetRefId,
                publicationTime
            };
            last_tx = transaction.last_tx;
        }
        return {datasetResult: {data: 'OK', status: 200}, datasetRefId, publicationTime, nbChunks};
    };

    static getErrorMessage = (koResult) => {
        return {message: koResult.data || `an error ${koResult.status} occurred`, error: true};
    };

    static hasError = (result) => result.data !== 'OK' || result.status !== 200;

    static publishModel = async (modelItem, datasetRefId, publicationTime, nbChunks) => {
        const communityModel = {
            ...modelItem,
            id: undefined,
            datasetRefId,
            isCommunityModel: true,
            publicationTime,
            nbChunks
        };
        const address = this.#address;
        const modelTags = [
            {name: AR_MODEL_TAG_NAME, value: 'true'},
            {name: AR_MODEL_NAME_TAG_NAME, value: communityModel.name},
            {name: AR_MODEL_DESCRIPTION_TAG_NAME, value: communityModel.description},
            {name: AR_YEAR_TAG_NAME, value: (new Date(publicationTime)).getFullYear().toString()},
            {name: AR_FROM_TAG_NAME, address},
            ...this.getSearchTags(modelItem.name, modelItem.description)
        ];
        const modelTransaction = await this.generateSignedTransaction(communityModel, modelTags);
        return await this.postTransaction(modelTransaction);
    };

    static getSearchTags = (name, description) => {
        const tags = [];
        const maxSearchableCharacters = 20;
        const uniqueWords = [...new Set((name + ' ' + description).toLowerCase().split(' '))];
        const searchable = name.toLowerCase().substring(0, maxSearchableCharacters);
        for (let i = 1; i < searchable.length; i++) {
            tags.push({name: AR_NAME_SEARCH_TAG_NAME + i, value: searchable.substring(0, i)});
        }
        uniqueWords.forEach((word, index) => tags.push({
            name: AR_WORD_TAG_NAME + index, value: word
        }));
        return tags;
    };

    static publish = async (modelItem, dataset) => {
        const publicationTime = Date.now();
        const {datasetResult, datasetRefId, nbChunks} = await this.publishDataset(modelItem, dataset, publicationTime);
        if (this.hasError(datasetResult)) {
            return this.getErrorMessage(datasetResult);
        } else {
            const modelResult = await this.publishModel(modelItem, datasetRefId, publicationTime, nbChunks);
            if (this.hasError(modelResult)) return this.getErrorMessage(modelResult);
            let message = `The publish process has started 👍 ! It usually takes a few minutes to be on the blockchain. `;
            message += `Publishing duration depends on the training level, a well trained model will take more time to be fully published.`;
            return {message, error: false};
        }
    };

    static generateSignedTransaction = async (payload, tags = [], last_tx) => {
        const data = JSON.stringify(payload);
        const transaction = await this.#arweave.createTransaction({data, last_tx}, this.#jwk);
        tags.concat(AR_DEFAULT_TAGS).forEach(tag => transaction.addTag(tag.name, tag.value));
        await this.#arweave.transactions.sign(transaction, this.#jwk);
        return transaction;
    };

    static getStoredTransaction = async (arql) => {
        const txIds = await this.#arweave.arql(arql);
        const txs = txIds.map(async (txId) => this.#arweave.transactions.get(txId));
        return Promise.all(txs);
    };

    static generateArql = (arql) => {
        return {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: AR_APP_NAME_TAG.name,
                expr2: AR_APP_NAME_TAG.value
            },
            expr2: {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: AR_APP_VERSION_TAG.name,
                    expr2: AR_APP_VERSION_TAG.value
                },
                expr2: arql
            }
        };
    };

    static getTransactionData = async (arql, isString = true) => {
        const txs = await this.getStoredTransaction(arql);
        const totalCount = txs.length;
        const results = txs.map(tx => {
            const decodedData = this.#arweave.utils.b64UrlToString(tx.data);
            return isString ? {...JSON.parse(decodedData), id: tx.id} : decodedData;
        });
        return {
            totalCount,
            data: await Promise.all(results),
        };
    };

    static getAllModels = async () => {
        const arql = this.generateArql({op: 'equals', expr1: AR_MODEL_TAG_NAME, expr2: 'true'});
        return await this.getTransactionData(arql);
    };

    static getItems = async (type, keyName, keyValue, isString = true) => {
        const arql = this.generateArql({
            op: 'and',
            expr1: {
                op: 'equals', expr1: type, expr2: 'true'
            },
            expr2: {
                op: 'equals', expr1: keyName, expr2: keyValue
            }
        });
        const result = await this.getTransactionData(arql, isString);
        return (result && result.data) || null;
    };

    static getModelDatasetItem = async (id) => {
        const items = await this.getItems(AR_MODEL_DATASET_TAG_NAME, AR_MODEL_DATASET_ID_TAG_NAME, id, false);
        const parsedItems = items.map(item => JSON.parse(item));
        parsedItems.sort((a, b) => b.chunkIndex < a.chunkIndex ? 1 : -1);
        const chunks = parsedItems.map(item => item.chunk);
        const joined = chunks.join('');
        return JSON.parse(joined);
    };

    static getModelItem = async (modelTransactionId) => {
        const transactionData = await this.#arweave.transactions.getData(modelTransactionId, {
            decode: true,
            string: true
        });
        const result = JSON.parse(transactionData);
        return {...result, id: modelTransactionId};
    }
}

export default ArweaveService;
