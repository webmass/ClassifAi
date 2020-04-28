import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knn from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';

class TensorFlowService {
    static #model;
    static #knnClassifier = knn.create();
    static getModel = () => this.#model;
    static getKnnClassifier = () => this.#knnClassifier;

    static initBaseModel = async (modelFile = 'model.json', version = 1, alpha = 1) => {
        this.#model = await mobilenet.load({
            version,
            alpha,
            modelUrl: `${process.env.PUBLIC_URL}/model/${modelFile}`,
        });
    };

    static clear = () => {
        this.#knnClassifier.clearAllClasses();
    };

    static setKnnDataset = storedDataset => {
        let dataset = {};
        Object.keys(storedDataset).forEach((key) => {
            dataset[key] = tf.tensor(storedDataset[key], [storedDataset[key].length / 1024, 1024]);
        });
        this.#knnClassifier.setClassifierDataset(dataset);
    };

    static trainCategory = (category, img) => {
        const activation = this.#model.infer(img, 'conv_preds');
        this.#knnClassifier.addExample(activation, category);
    };

    static getImageKnnPrediction = async (image) => {
        const activation = this.#model.infer(image, 'conv_preds');
        const classifications = await this.#knnClassifier.predictClass(activation).catch(() => []);
        return {
            label: classifications.label
        }
    };

    static getStorableKnnDataset = () => {
        const knnDataset = this.#knnClassifier.getClassifierDataset();
        let storableDataset = {};
        Object.keys(knnDataset).forEach((category) => {
            let data = knnDataset[category].dataSync();
            storableDataset[category] = Array.from(data);
        });
        return storableDataset;
    };

    static getCategoriesCounts = () => {
        return this.#knnClassifier.getClassExampleCount();
    };

    static getNbTrainings = () => {
        const counts = this.getCategoriesCounts();
        let nb = 0;
        Object.keys(counts).forEach((category) => {
            nb += counts[category];
        });
        return nb;
    };

    static downloadModel = (exportName = 'download') => {
        let storableDataset = this.getStorableKnnDataset();
        const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(storableDataset))}`;
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', exportName + '.json');
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
};

export default TensorFlowService
