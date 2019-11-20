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
      spotifyApi.getAudioFeaturesForTracks(trackIds).then((data) => {
        that.setState({
          accessToken,
          tracks,
          tracksAudioFeatures: data.audio_features
        });
        // FIXME: this is chilling in here. Maybe we can move it if we want
        ApiProvider.spotifyGetGenresForAllTracks(that);
      }, (error) => {
        console.error(error);
      });
    });
  },

  // Retrevies track genres
  // Calls a subroutine for batching. Makes promises and assigns as they come in
  // We probably need error checking here (or not. Caching is hard)
  // FIXME: the promises resolve asynchronously. We need to keep them in order or rearrange as they come in
  spotifyGetGenresForAllTracks: (that) => {
    var genres = [];
    for (var genreIndex = 0; genreIndex < that.state.tracks.length-1; genreIndex += MaxArtistsPerRequest) {
      ApiProvider.spotifyGetGenresForBatchOfTracks(that, genreIndex
      ).then(genresBatch => {
        genresBatch.forEach((arrayItem) => {
          genres.push(arrayItem);
        });
      });
    }
    that.setState({
      genres: genres
    });
  },

  // Retrieves the genres assigned to the first artist of a track and assigns them to the track.
  // Performs this operation for a maximum of 50 tracks, as per Spotify's API limit.
  spotifyGetGenresForBatchOfTracks: (that, startIndex) => {
    var index = startIndex;
    var endIndex = min(startIndex + MaxArtistsPerRequest-1, that.state.tracks.length-1);
    var idBatch = '';
    if (index <= endIndex) {
      idBatch = that.state.tracks[index].artist[0].id;
      index++;
    }
    while (index <= endIndex) {
      idBatch = idBatch.concat(',' + that.state.tracks[index].artist[0].id); //tracks.artist[i]
      index++;
    }

    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + that.state.accessToken
    };
    var response = axios.get('https://api.spotify.com/v1/artists', {
      params: {
        'ids': idBatch
      }
    }).then((response) => {
      var genresBatch = [];
      for (var i = 0; i < response.data.artists.length; i++) {
        that.state.tracks[startIndex+i].genres = response.data.artists[i].genres;
        genresBatch.push(that.state.tracks[startIndex+i].genres);
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
      that.setState({
        tracksAudioFeatures: response.data.total
      });

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

  createDataByPCA: (songs, songNames) => {
    const features = ['acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'valence', 'tempo'];
    let feature2Data = {};
    for (let feature of features) {
      let featureData = [];
      for (let song of songs) {
        featureData.push(song[feature]);
      }
      featureData = ApiProvider.standardize(featureData);
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
