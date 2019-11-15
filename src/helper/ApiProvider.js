import axios from 'axios';

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
  }
};

export default ApiProvider;
