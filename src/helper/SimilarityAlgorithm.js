import { mean, std, min, max, dot, variance } from 'mathjs';
import { PCA } from 'ml-pca';

const Algorithm = {
  standardize: (arr) => {
    const mean_ = mean(arr);
    const std_ = std(arr);
    let newArr;
    if (std_ !== 0) {
      newArr = arr.map(x => (x - mean_) / std_);
    }
    else {
      newArr = arr.map(x => 0);
    }
    return newArr;
  },

  minMaxNormalize: (arr) => {
    const min_ = min(arr);
    const max_ = max(arr);
    let newArr;
    if (min_ < max_) {
      newArr = arr.map(x => (x - min_) / (max_ - min_));
    }
    else {
      newArr = arr.map(x => 0.5);
    }
    return newArr;
  },

  createDataByPCA: (featureData) => {
    // featureData
    // {
    //     feature1: [...features],
    //     feature2: [...features],
    // }
    const features = Object.keys(featureData);
    let newFeatureData = {};
    for (let feature of features) {
      let data = featureData[feature];
      data = Algorithm.standardize(data);
      newFeatureData[feature] = data;
    }

    const sampleNum = newFeatureData[features[0]].length;
    let dataset = [];
    for (let i = 0; i < sampleNum; i++) {
      let rowData = [];
      for (let feature of features) {
        rowData.push(newFeatureData[feature][i]);
      }
      dataset.push(rowData);
    }

    const pca = new PCA(dataset);
    const vectors = pca.getEigenvectors();
    const featureNum = vectors.rows;
    let xVector = [];
    let yVector = [];
    for (let i = 0; i < featureNum; i++) {
      xVector.push(vectors.get(i, 0));
      yVector.push(vectors.get(i, 1));
    }
    let xData = [];
    let yData = [];
    for (let data of dataset) {
      xData.push(dot(data, xVector));
      yData.push(dot(data, yVector));
    }

    xData = Algorithm.minMaxNormalize(xData);
    yData = Algorithm.minMaxNormalize(yData);

    return Algorithm.getPositions(xData, yData);
  },

  createDataByVariance: (featureData) => {
    const features = Object.keys(featureData);
    let variances = [];
    for (let feature of features) {
      variances.push([variance(featureData[feature]), feature]);
    }
    variances.sort((a, b) => b[0] - a[0]);
    const xFeature = variances[0][1];
    const yFeature = variances[1][1];

    let xData = featureData[xFeature];
    let yData = featureData[yFeature];

    xData = Algorithm.minMaxNormalize(xData);
    yData = Algorithm.minMaxNormalize(yData);

    return Algorithm.getPositions(xData, yData);
  },

  createDataBySelection: (featureData, xFeature, yFeature) => {
    let xData = featureData[xFeature];
    let yData = featureData[yFeature];

    xData = Algorithm.minMaxNormalize(xData);
    yData = Algorithm.minMaxNormalize(yData);

    return Algorithm.getPositions(xData, yData);
  },

  getPositions: (xData, yData) => {
    let positions = [];
    for (let i = 0; i < xData.length; i++) {
      positions.push([xData[i] * 100, yData[i] * 100]);
    }

    return positions;
  }
};

export default Algorithm;