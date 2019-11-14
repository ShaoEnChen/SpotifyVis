import axios from 'axios';
import qs from 'qs';
import {min, max, variance} from 'mathjs';

const dataProvider = {
  normalize: (arr) => {
      const min_ = min(arr);
      const max_ = max(arr);
      let new_arr = [];
      if (min_ < max_) {
        for (let x of arr) {
          new_arr.push((x - min_) / (max_ - min_) * 100);
        }
      }
      else {
        for (let x of arr) {
          new_arr.push(50);
        }
      }
      return new_arr;
  },
  createDataByVariance: (songs, songNames) => {
    const features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence', 'tempo'];
    let feature2data = {};
    let variances = [];
    for (let feature of features) {
      let featureData = [];
      for (let song of songs) {
        featureData.push(song[feature]);
      }
      feature2data[feature] = featureData;

      const variance_ = variance(featureData);
      variances.push([variance_, feature]);
    }
    variances.sort((a, b) => b[0] - a[0]);
    const x_feature = variances[0][1];
    const y_feature = variances[1][1];

    let x_data = feature2data[x_feature];
    let y_data = feature2data[y_feature];

    x_data = dataProvider.normalize(x_data);
    y_data = dataProvider.normalize(y_data);

    let data = {features: [x_feature, y_feature]};
    let songData = []
    for (let i = 0; i < songNames.length; i++) {
      songData.push({
        songName: songNames[i],
        position: [x_data[i], y_data[i]]
      });
    }
    data.songs = songData;
    return data;
  },
  createDataBySelection: (songs, songNames, x_feature, y_feature) => {
    const features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence', 'tempo'];
    let feature2data = {};
    for (let feature of features) {
      let featureData = [];
      for (let song of songs) {
        featureData.push(song[feature]);
      }
      feature2data[feature] = featureData;
    }
    let x_data = feature2data[x_feature];
    let y_data = feature2data[y_feature];

    x_data = dataProvider.normalize(x_data);
    y_data = dataProvider.normalize(y_data);

    let data = {features: [x_feature, y_feature]};
    let songData = []
    for (let i = 0; i < songNames.length; i++) {
      songData.push({
        songName: songNames[i],
        position: [x_data[i], y_data[i]]
      });
    }
    data.songs = songData;
    return data;
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
