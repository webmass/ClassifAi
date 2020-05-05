import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knn from '@tensorflow-models/knn-classifier';
import * as tf from '@tensorflow/tfjs';

class TensorFlowService {
    static #localBaseModelPath = 'indexeddb://base_model';
    static #mobilenet;
    static #knnClassifier = knn.create();

    static initBaseModel = async (modelFile = 'model.json', version = 1, alpha = 1) => {
        const hasCachedBaseModel = !!await tf.loadGraphModel(this.#localBaseModelPath);
        this.#mobilenet = await mobilenet.load({
            version,
            alpha,
            modelUrl: hasCachedBaseModel ? this.#localBaseModelPath : undefined
        });
        if(hasCachedBaseModel) {
            this.#mobilenet.model.save('indexeddb://base_model');
        }
    };

    static clear = () => {
        this.#knnClassifier.clearAllClasses();
    };

    static getNumClasses = () => this.#knnClassifier.getNumClasses();

    static setKnnDataset = storedDataset => {
        let dataset = {};
        Object.keys(storedDataset).forEach((key) => {
            dataset[key] = tf.tensor(storedDataset[key], [storedDataset[key].length / 1024, 1024]);
        });
        this.#knnClassifier.setClassifierDataset(dataset);
    };

    static trainCategory = (category, img) => {
        const activation = this.#mobilenet.infer(img, 'conv_preds');
        this.#knnClassifier.addExample(activation, category);
    };

    static getImageKnnPrediction = async (image) => {
        const activation = this.#mobilenet.infer(image, 'conv_preds');
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

    static getPredictionFromWebcam = async (webcam) => {
        const img = await webcam.capture().catch(() => null);
        if (img) {
            const prediction = await TensorFlowService.getImageKnnPrediction(img);
            img.dispose();
            return prediction;
        }
        return null;
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
