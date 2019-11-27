import axios from 'axios';
import Algorithm from './SimilarityAlgorithm';

const MaxArtistsPerRequest = 50;

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
    } else if (xFeature && yFeature) {
      return Algorithm.createDataBySelection(audioFeatures, xFeature, yFeature);
    } else {
      return Algorithm.createDataByPCA(audioFeatures);
    }
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
        tracks[index] = {
          ...tracks[index],
          audioFeatures
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
    for (let startIndex = 0; startIndex < tracks.length; startIndex += MaxArtistsPerRequest) {
      ApiProvider.spotifyGetGenresForBatchOfTracks(startIndex, tracks, that).then(genresBatch => {
        genresBatch.forEach((genres, genreIndex) => {
          tracks[startIndex + genreIndex] = {
            ...tracks[startIndex + genreIndex],
            genres
          }
        });
      });
    }
    that.setState({ tracks }, () => {
      ApiProvider.getSongsCanvasPosition(that);
    });
  },

  // Retrieves the genres assigned to the first artist of a track and assigns them to the track.
  // Performs this operation for a maximum of 50 tracks, as per Spotify's API limit.
  spotifyGetGenresForBatchOfTracks: (startIndex, tracks, that) => {
    let index = startIndex;
    let endIndex = Math.min(startIndex + MaxArtistsPerRequest, tracks.length) - 1;
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
  }
};

export default ApiProvider;
