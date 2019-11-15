import axios from 'axios';
import qs from 'qs';
import {mean, std, min, max, dot, variance} from 'mathjs';

const dataProvider = {
  standardize: (arr) => {
    const mean_ = mean(arr);
    const std_ = std(arr);
    let newArr;
    if (std_ != 0) {
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
  createDataByPCA: (songs, songNames) => {
    const features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence', 'tempo'];
    let feature2Data = {};
    for (let feature of features) {
      let featureData = [];
      for (let song of songs) {
        featureData.push(song[feature]);
      }
      featureData = dataProvider.standardize(featureData);
      feature2Data[feature] = featureData;
    }

    const sampleNum = feature2Data[features[0]].length;
    const featureNum = features.length;
    let dataset = [];
    for (let i = 0; i < sampleNum; i++) {
      let rowData = [];
      for (let j = 0; j < featureNum; j++) {
        rowData.push(feature2Data[features[j]][i]);
      }
      dataset.push(rowData);
    }

    const {PCA} = require('ml-pca');
    const pca = new PCA(dataset);
    const vectors = pca.getEigenvectors();
    const rowNum = vectors.rows;
    let xVector = [];
    let yVector = [];
    for (let i = 0; i < rowNum; i++) {
      xVector.push(vectors.get(i, 0));
      yVector.push(vectors.get(i, 1));
    }
    let xData = [];
    let yData = [];
    for (let data of dataset) {
      xData.push(dot(data, xVector));
      yData.push(dot(data, yVector));
    }

    xData = dataProvider.minMaxNormalize(xData);
    yData = dataProvider.minMaxNormalize(yData);

    const songNum = songNames.length;
    let songData = []
    for (let i = 0; i < songNum; i++) {
      songData.push({
        songName: songNames[i],
        position: [xData[i] * 100, yData[i] * 100]
      });
    }
    return {features: ['', ''], songs: songData};
  },
  createDataByVariance: (songs, songNames) => {
    const features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence', 'tempo'];
    let feature2Data = {};
    let variances = [];
    for (let feature of features) {
      let featureData = [];
      for (let song of songs) {
        featureData.push(song[feature]);
      }
      feature2Data[feature] = featureData;

      const variance_ = variance(featureData);
      variances.push([variance_, feature]);
    }
    variances.sort((a, b) => b[0] - a[0]);
    const xFeature = variances[0][1];
    const yFeature = variances[1][1];

    let xData = feature2Data[xFeature];
    let yData = feature2Data[yFeature];

    xData = dataProvider.minMaxNormalize(xData);
    yData = dataProvider.minMaxNormalize(yData);

    const songNum = songNames.length;
    let songData = []
    for (let i = 0; i < songNum; i++) {
      songData.push({
        songName: songNames[i],
        position: [xData[i] * 100, yData[i] * 100]
      });
    }
    return {features: [xFeature, yFeature], songs: songData};
  },
  createDataBySelection: (songs, songNames, xFeature, yFeature) => {
    const features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence', 'tempo'];
    let feature2Data = {};
    for (let feature of features) {
      let featureData = [];
      for (let song of songs) {
        featureData.push(song[feature]);
      }
      feature2Data[feature] = featureData;
    }

    let xData = feature2Data[xFeature];
    let yData = feature2Data[yFeature];

    xData = dataProvider.minMaxNormalize(xData);
    yData = dataProvider.minMaxNormalize(yData);

    const songNum = songNames.length;
    let songData = []
    for (let i = 0; i < songNum; i++) {
      songData.push({
        songName: songNames[i],
        position: [xData[i] * 100, yData[i] * 100]
      });
    }
    return {features: [xFeature, yFeature], songs: songData};
  },
  createRandomSongs: () => {
    let songs = {};
    let songNum = 30;

    for (let i = 0; i < songNum; i++) {
      songs[i] = {
        songName: 'random' + (i + 1),
        position: [
          Math.random() * 100,
          Math.random() * 100
        ]
      };
    }

    return songs;
  },
  spotifyGet: () => {
    const accessToken = 'BQAgnXShwOKcLv93A7NhWknXlXoJtZapu4KuhIHO0wuqJkPPr0uQIop32nxUHggMKSVfRdFJdEkVvjJvBECizv98AG10f0cON21_eUyNt4748Ifs8PloqUMhNGtKCAGLcGy4NipTRNmSjQGMoLTcZy_chNMUHp4lH4bfHQOSY9c3KZJ4QF-3iEu4';
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + accessToken
    };

    axios.get('https://api.spotify.com/v1/audio-features', {
      params: {
        // name: 'Flavio',
        ids: '4JpKVNYnVcJ8tuMKjAj50A,2NRANZE9UCmPAS5XVbXL40,24JygzOLM0EmRQeGtFcIcG'
      }
    }).then((response) => {
      console.log(response.data);
    });
  },
  spotifyPost: () => {
    const cors_url = 'https://cors-anywhere.herokuapp.com/';
    const api_url = 'https://accounts.spotify.com/api/token';
    const request_url = cors_url + api_url;
    const clientId = '436d61cb446a48b0a9867aed113380c4';
    const clientSecret = '647ae3f395474d74bde32870ccf955e7';
    const basicAuth = 'Basic ' + btoa(clientId + ':' + clientSecret);
    const bodyParameters = {
      grant_type: 'client_credentials',
      refresh_token: 'BQDLgWFfNca-UOxmt8oBYyorMVhRI0Na2sBhk0ieCApurG4_V_x52gwohg3EXiwdMjtsTnoENPsrKXqa526Cr6VzYX5B8eWbJaemyhgPNksXOix8vo4xMdyIapi8jXwwams1x8mqaT6AGEZlAAJloW4wIs_IgxQhear7He-Qx7tfjqb62Wk6TSMv'
    };

    axios.post(request_url, qs.stringify(bodyParameters), {
      headers: {
        'Authorization': basicAuth,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  }
  // More APIs, I mean our APIs that can be directly called in Viz page
};

export default dataProvider;
