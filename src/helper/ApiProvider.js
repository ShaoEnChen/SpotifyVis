import axios from 'axios';
import { mean, std, min, max, dot, variance } from 'mathjs';
import { PCA } from 'ml-pca';

const MaxArtistsPerRequest = 50;

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

  spotifyGetTracksAndAudioFeatures: (spotifyApi, playlistId, that) => {
    spotifyApi.setAccessToken(that.state.accessToken);
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
      ApiProvider.spotifyGetAudioFeatures(tracks, spotifyApi, that);
      
    }).catch((error) => {
      console.log(error);
    });
  },

  spotifyGetAudioFeatures: (tracks, spotifyApi, that) => {
    const trackIds = tracks.map((track) => track.id);
    spotifyApi.getAudioFeaturesForTracks(trackIds).then((data) => {
      data.audio_features.forEach((element, index) => {
        const audio_features = {
          acousticness: element.acousticness,
          danceability: element.danceability,
          energy: element.energy,
          instrumentalness: element.instrumentalness,
          liveness: element.liveness,
          loudness: element.loudness,
          speechiness: element.speechiness,
          valence: element.valence,
          tempo: element.tempo,
        };
        tracks[index] = {
          ...tracks[index],
          ...audio_features
        }
      });
      return tracks;

    }).then((tracks) => {
      ApiProvider.spotifyGetGenresForAllTracks(tracks, that);
    });
  },

  // Retrevies track genres
  // Calls a subroutine for batching. Makes promises and assigns as they come in
  // We probably need error checking here (or not. Caching is hard)
  // FIXME: the promises resolve asynchronously. We need to keep them in order or rearrange as they come in
  spotifyGetGenresForAllTracks: (tracks, that) => {
    for (let genreIndex = 0; genreIndex < tracks.length; genreIndex += MaxArtistsPerRequest) {
      ApiProvider.spotifyGetGenresForBatchOfTracks(genreIndex, tracks, that).then(genresBatch => {
        genresBatch.forEach((genres, index) => {
          tracks[index] = {
            ...tracks[index],
            genres
          }
        });
      });
    }
    that.setState({
      tracks
    });
  },

  // Retrieves the genres assigned to the first artist of a track and assigns them to the track.
  // Performs this operation for a maximum of 50 tracks, as per Spotify's API limit.
  spotifyGetGenresForBatchOfTracks: (startIndex, tracks, that) => {
    let index = startIndex;
    let endIndex = min(startIndex + MaxArtistsPerRequest, tracks.length) - 1;
    let idBatch = '';
    if (index <= endIndex) {
      idBatch = tracks[index].artist[0].id;
      index++;
    }
    while (index <= endIndex) {
      idBatch = idBatch.concat(',' + tracks[index].artist[0].id);
      index++;
    }

    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + that.state.accessToken
    };
    let response = axios.get('https://api.spotify.com/v1/artists', {
      params: {
        'ids': idBatch
      }
    }).then((response) => {
      let genresBatch = [];
      for (let i = 0; i < response.data.artists.length; i++) {
        genresBatch.push(response.data.artists[i].genres);
      }
      return genresBatch;

    }).catch((error) => {
      console.log(error);
    });

    return response;
  },

  // Retrieves the total number of songs that we're going to need to grab.
  spotifyGetPlaylistTrackCount: (accessToken, playlistId, that) => {
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + accessToken
    };

    axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
      params: {
        'fields': 'total'
      }
    }).then((response) => {
      console.log(response.data);
      // that.setState({
      //   // Should not set the total number of tracks to tracksAudioFeatures
      //   tracksAudioFeatures: response.data.total
      // });

    }).catch((error) => {
      console.log(error);
    });
  },

  spotifyGetPlaylistBatch: (accessToken, playlistId) => {
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
