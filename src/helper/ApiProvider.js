import axios from 'axios';
import { mean, std, min, max, dot, variance } from 'mathjs';
import { PCA } from 'ml-pca';

const ApiProvider = {
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

  spotifyGetTracksAndAudioFeatures: (spotifyApi, accessToken, playlistId, that) => {
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getPlaylistTracks(playlistId).then((data) => {
      let tracks = [];
      data.items.forEach((arrayItem) => {
        let track = {
          songName: arrayItem.track.name,
          id: arrayItem.track.id,
          artist: arrayItem.track.artists,
          album: arrayItem.track.album
        };
        tracks.push(track);
      });
      return tracks;

    }).then((tracks) => {
      const trackIds = tracks.map((track) => track.id);
      // console.log("trackIds",trackIds);
      spotifyApi.getAudioFeaturesForTracks(trackIds).then((data) => {
        let audio_fs ={} ;
        audio_fs.acousticness = [];
        audio_fs.danceability = [];
        audio_fs.energy = [];
        audio_fs.instrumentalness = [];
        audio_fs.liveness = [];
        audio_fs.loudness = [];
        audio_fs.speechiness = [];
        audio_fs.valence = [];
        audio_fs.tempo = [];
        for(let elem of data.audio_features){
          audio_fs.acousticness.push(elem.acousticness);
          audio_fs.danceability.push(elem.danceability);
          audio_fs.energy.push(elem.energy);
          audio_fs.instrumentalness.push(elem.instrumentalness);
          audio_fs.liveness.push(elem.liveness);
          audio_fs.loudness.push(elem.loudness);
          audio_fs.speechiness.push(elem.speechiness);
          audio_fs.valence.push(elem.valence);
          audio_fs.tempo.push(elem.tempo);
        }

        that.setState({
          accessToken,
          tracks,
          // tracksAudioFeatures: data.audio_features
          tracksAudioFeatures: audio_fs
        });
      }, (error) => {
        console.error(error);
      });
    });
  },

  //Retrieves the total number of songs that we're going to need to grab.
  spotifyGetPlaylistTrackCount: (accessToken, playlistId) => {
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + accessToken
    };

    axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
      params: {
        'fields': 'total'
      }
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });
  },

  spotifyGetPlaylistPage: (accessToken, playlistId) => {
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + accessToken
    };
    axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
      params: {
        'fields': 'items(track(id))',
        'offset': 0
      }
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });;
  },

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

  createDataByPCA: (featureData, songNames) => {
    const features = Object.keys(featureData);
    let newFeatureData = {};
    for (let feature of features) {
      let data = featureData[feature];
      data = ApiProvider.standardize(data);
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

    xData = ApiProvider.minMaxNormalize(xData);
    yData = ApiProvider.minMaxNormalize(yData);

    const songNum = songNames.length;
    let songData = []
    for (let i = 0; i < songNum; i++) {
      songData.push({
        songName: songNames[i],
        position: [xData[i] * 100, yData[i] * 100]
      });
    }
    return { features: ['', ''], songs: songData };
  },

  createDataByVariance: (featureData, songNames) => {
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

    xData = ApiProvider.minMaxNormalize(xData);
    yData = ApiProvider.minMaxNormalize(yData);

    const songNum = songNames.length;
    let songData = []
    for (let i = 0; i < songNum; i++) {
      songData.push({
        songName: songNames[i],
        position: [xData[i] * 100, yData[i] * 100]
      });
    }
    return { features: [xFeature, yFeature], songs: songData };
  },

  createDataBySelection: (featureData, songNames, xFeature, yFeature) => {
    let xData = featureData[xFeature];
    let yData = featureData[yFeature];

    xData = ApiProvider.minMaxNormalize(xData);
    yData = ApiProvider.minMaxNormalize(yData);

    const songNum = songNames.length;
    let songData = []
    for (let i = 0; i < songNum; i++) {
      songData.push({
        songName: songNames[i],
        position: [xData[i] * 100, yData[i] * 100]
      });
    }
    return { features: [xFeature, yFeature], songs: songData };
  }
};

export default ApiProvider;
