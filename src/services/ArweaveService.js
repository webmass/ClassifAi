import Arweave from 'arweave/web';
import {
    AR_DEFAULT_TAG,
    AR_MODEL_DATASET_TAG_NAME, AR_MODEL_DESCRIPTION_TAG_NAME, AR_MODEL_NAME_TAG_NAME, AR_MODEL_TAG_NAME,
    AR_MODEL_TRANSACTION_ID_TAG_NAME,
    DB_SETTINGS
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

    static publishModelDataset = async (modelTransactionId, dataset) => {
        const tags = [
            {name: AR_MODEL_DATASET_TAG_NAME, value: 'true'},
            {name: AR_MODEL_TRANSACTION_ID_TAG_NAME, value: modelTransactionId},
        ];
        const signedModelDatasetTransaction = await this.generateSignedTransaction({
            modelId: modelTransactionId,
            data: dataset
        }, tags, this.#jwk);
        return await this.postTransaction(signedModelDatasetTransaction);
    };

    static publishModel = async (modelItem, dataset) => {
        const unsignedModel = {...modelItem, id: undefined, isCommunityModel: true};
        const tags = [
            {name: AR_MODEL_TAG_NAME, value: 'true'},
            {name: AR_MODEL_NAME_TAG_NAME, value: unsignedModel.name},
            {name: AR_MODEL_DESCRIPTION_TAG_NAME, value: unsignedModel.description}
        ];
        const signedModelTransaction = await this.generateSignedTransaction(unsignedModel, tags, this.#jwk);
        const datasetResult = await this.publishModelDataset(signedModelTransaction.id, dataset);
        if (datasetResult.message === 'OK') {
            const modelResult = await this.postTransaction(signedModelTransaction);
            if (modelResult.message === 'OK') {
                modelResult.message = `The publish process has started 👍 ! It usually takes a few minutes to be on the blockchain. `;
                modelResult.message += `Publishing duration depends on the training level, a well trained model will take more time to be fully published.`;
            }
            return modelResult;
        }
        return datasetResult;
    };

    static generateSignedTransaction = async (payload, tags = [], jwk) => {
        const transaction = await this.#arweave.createTransaction({data: JSON.stringify(payload)}, jwk);
        tags.concat([AR_DEFAULT_TAG]).forEach(tag => transaction.addTag(tag.name, tag.value));
        await this.#arweave.transactions.sign(transaction, jwk);
        return transaction;
    };

    static postTransaction = async (transaction) => {
        const result = await this.#arweave.transactions.post(transaction);
        const resultType = result.status >= 200 && result.status < 300 ? 'success' : 'error';
        return {...result, transaction, resultType, message: result.data};
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
                expr1: AR_DEFAULT_TAG.name,
                expr2: AR_DEFAULT_TAG.value,
            },
            expr2: arql
        };
    };

    static getTransactionData = async (arql) => {
        const txs = await this.getStoredTransaction(arql);
        const totalCount = txs.length;
        const results = txs.map(async (tx) => ({
            ...JSON.parse(await this.#arweave.transactions.getData(tx.id, {decode: true, string: true})),
            // timestamp: await getTimestampFromTxId(tx.id),
            id: tx.id,
        }));
        return {
            totalCount,
            data: await Promise.all(results),
        };
    };

    static getAllModels = async () => {
        const arql = this.generateArql({op: 'equals', expr1: AR_MODEL_TAG_NAME, expr2: 'true'});
        return await this.getTransactionData(arql);
    };

    static getItem = async (type, keyName, keyValue) => {
        const arql = this.generateArql({
            op: 'and',
            expr1: {
                op: 'equals', expr1: type, expr2: 'true'
            },
            expr2: {
                op: 'equals', expr1: keyName, expr2: keyValue
            }
        });
        const result = await this.getTransactionData(arql);
        return (result && result.data && result.data[0]) || null;
    };

    static getModelDatasetItem = async (modelTransactionId) => {
        return this.getItem(AR_MODEL_DATASET_TAG_NAME, AR_MODEL_TRANSACTION_ID_TAG_NAME, modelTransactionId);
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

//
// export const getPredictionsTxs = async (address) => {
//     const txids = await arweave.arql({
//         op: 'and',
//         expr1: {
//             op: 'equals',
//             expr1: AR_DEFAULT_TAG.name,
//             expr2: AR_DEFAULT_TAG.value,
//         },
//         expr2: {
//             op: 'equals',
//             expr1: 'coinbox-prediction',
//             expr2: 'test2',
//         },
//     });
//
//     const txs = txids.map(async (txId) => arweave
//         .transactions
//         .get(txId));
//
//     return Promise.all(txs);
// };
//
// export const getTimestampFromTxId = async (txId) => {
//     const {status, confirmed} = await arweave
//         .transactions
//         .getStatus(txId);
//     if (status !== 200) {
//         console.error(`Block status (txId: "${txId}") is not OK`);
//         return -1;
//     }
//     const {data} = await axios(`https://arweave.net/block/height/${confirmed.block_height}`);
//     return data.timestamp;
// };
//
// export const listPredictions = async (address, reduce) => {
//     let txs = await getPredictionsTxs(address);
//     const totalCount = txs.length;
//     if (reduce && typeof reduce === 'function') {
//         txs = reduce(txs);
//     }
//     const predictions = txs.map(async (tx) => ({
//         ...JSON.parse(await arweave.transactions.getData(tx.id, {decode: true, string: true})),
//         timestamp: await getTimestampFromTxId(tx.id),
//         id: tx.id,
//     }));
//     return {
//         totalCount,
//         txs: await Promise.all(predictions),
//     };
// };

export default ArweaveService;
