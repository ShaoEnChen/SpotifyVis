import axios from 'axios';
import Algorithm from './SimilarityAlgorithm';

const MaxArtistsPerRequest = 50;
const MaxTracksPerRequest = 100;


async function audioFeaturesHelper(tracks, spotifyApi, that) {
  const trackIds = tracks.map((track) => track.id);
  //console.log('entering main track features function');

  for (let startIndex = 0; startIndex < tracks.length; startIndex += MaxTracksPerRequest) {
    //console.log('calling a batch of track features');
    let endIndex = Math.min(startIndex + MaxTracksPerRequest, tracks.length);
    const idBatch = trackIds.slice(startIndex, endIndex);
    await spotifyApi.getAudioFeaturesForTracks(idBatch).then((data) => {
      data.audio_features.forEach((element, index) => {
        const audioFeatures = {
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
        tracks[startIndex + index] = {
          ...tracks[startIndex + index],
          audioFeatures
        }
      });
      return Promise.resolve(tracks);
    });
  }
  return Promise.resolve(tracks);
}

async function genresHelper(tracks, that) {

  const genresDictionary = {};

  for (let startIndex = 0; startIndex < tracks.length; startIndex += MaxArtistsPerRequest) {
    await ApiProvider.spotifyGetGenresForBatchOfTracks(startIndex, tracks, that).then(genresBatch => {
      genresBatch.forEach((genres, genreIndex) => {
        genres.forEach((genre) => {
          if (!(genre in genresDictionary)) {
            genresDictionary[genre] = 1;
          } else {
            genresDictionary[genre] += 1;
          }
        });

        tracks[startIndex + genreIndex] = {
          ...tracks[startIndex + genreIndex],
          genres
        }
      });
    });
  }
  //console.log('calling song positions');
  that.setState({
    tracks,
    genresDictionary,
    genresFilter: Object.keys(genresDictionary).reduce((filter, genre) => {
      // Default to show all tracks
      filter[genre] = true;
      return filter;
    }, {})
  }, () => {
    ApiProvider.getSongsCanvasPosition(that);
  });
}

const ApiProvider = {

  getSongsCanvasPosition: (that) => {
    const tracks = that.state.tracks;
    const featuresBase = {
      acousticness: [],
      danceability: [],
      energy: [],
      instrumentalness: [],
      liveness: [],
      loudness: [],
      speechiness: [],
      tempo: [],
      valence: []
    };

    const audioFeatures = tracks.reduce((features, track) => {
      for (let feature in track.audioFeatures) {
        features[feature].push(track.audioFeatures[feature]);
      }
      return features
    }, featuresBase);

    const canvasPositions = ApiProvider.positionFactory(that.state, audioFeatures);

    tracks.forEach((track, index) => {
      track.position = canvasPositions[index];
    });

    that.setState({ tracks });
  },

  positionFactory: (state, audioFeatures) => {
    const algorithm = state.similarityAlgorithm;
    const xFeature = state.xAxisFeature;
    const yFeature = state.yAxisFeature;

    if (algorithm === 'Variance') {
      return Algorithm.createDataByVariance(audioFeatures);
    } else if (algorithm === 'Customed' && xFeature && yFeature) {
      return Algorithm.createDataBySelection(audioFeatures, xFeature, yFeature);
    } else {
      return Algorithm.createDataByPCA(audioFeatures);
    }
  },



  spotifyGetTracksAndAudioFeatures: (spotifyApi, playlistId, that) => {
    spotifyApi.setAccessToken(that.state.accessToken);
    ApiProvider.spotifyGetPlaylistTrackCount(playlistId, that).then((data) => {
      const total = data.total;
      let tracks = [];
      for (var index = 0; index < data.total; index += MaxTracksPerRequest) {
        ApiProvider.spotifyGetPlaylistTrackBatch(playlistId, index, that).then((data) => {
          data.items.forEach((arrayItem) => {
            let track = {
              songName: arrayItem.track.name,
              id: arrayItem.track.id,
              artists: arrayItem.track.artists,
              album: arrayItem.track.album
            };
            tracks.push(track);
          });
          if (tracks.length === total) {
            //console.log('about to call main track features');
            ApiProvider.spotifyGetAudioFeatures(tracks, spotifyApi, that);
          }
        });
      }
    })
  },

  spotifyGetAudioFeatures: (tracks, spotifyApi, that) => {
    audioFeaturesHelper(tracks, spotifyApi, that).then((data) => {
      ApiProvider.spotifyGetGenresForAllTracks(data, that);
    });
  },

  // Retrevies track genres
  // Calls a subroutine for batching. Makes promises and assigns as they come in
  // We probably need error checking here (or not. Caching is hard)
  spotifyGetGenresForAllTracks: (tracks, that) => {
    //console.log('starting main genres');
    genresHelper(tracks, that);
  },

  // Retrieves the genres assigned to the first artist of a track and assigns them to the track.
  // Performs this operation for a maximum of 50 tracks, as per Spotify's API limit.
  spotifyGetGenresForBatchOfTracks: (startIndex, tracks, that) => {
    //console.log('calling a batch of genres');
    let index = startIndex;
    let endIndex = Math.min(startIndex + MaxArtistsPerRequest, tracks.length) - 1;
    let idBatch = '';
    if (index <= endIndex) {
      idBatch = tracks[index].artists[0].id;
      index++;
    }
    while (index <= endIndex) {
      idBatch = idBatch.concat(',' + tracks[index].artists[0].id);
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
  spotifyGetPlaylistTrackCount: (playlistId, that) => {
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + that.state.accessToken
    };

    let response = axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
      params: {
        'fields': 'total'
      }
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      console.log(error);
    });
    return response;
  },

  spotifyGetPlaylistTrackBatch: (playlistId, index, that) => {
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + that.state.accessToken
    };
    return axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
      params: {
        'fields': 'items(track(id, name, artists, album))',
        'offset': index
      }
    }).then((response) => {
      //console.log(response.data);
      return response.data;
    }).catch((error) => {
      console.log(error);
    });
  }
};

export default ApiProvider;
