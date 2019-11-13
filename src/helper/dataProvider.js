import axios from 'axios';
import qs from 'qs';
//import {LogisticsTracker} from './logisticsTracker';

//FIXME: we should really be saving the access token somewhere instead of hardcoding it
const dataProvider = {
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
  spotifyGetSongFeatures: () => {
    const accessToken = 'BQDeKn3tKSnI6yJsgQwC-eOmhDYpsWiSoaQNYqLecifa43jvOV6FVc4LXT_laQsyih10KK0whkVfdWNzWUo';
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
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  },
  //Retrieves the total number of songs that we're going to need to grab.
  //FIXME: how do you store this data in react?
  spotifyGetPlaylistTrackCount: (playlistId) => {
    const accessToken = 'BQDeKn3tKSnI6yJsgQwC-eOmhDYpsWiSoaQNYqLecifa43jvOV6FVc4LXT_laQsyih10KK0whkVfdWNzWUo';
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + accessToken
    };

    axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
      params: {
        'fields': 'total'
      }
    }).then((response) => {
      console.log(response.data);
      //LogisticsTracker.limit = response.data.total;
      //console.log(LogisticsTracker.limit);
    });
  },
  spotifyGetPlaylistPage: (playlistId) => {
    const accessToken = 'BQDeKn3tKSnI6yJsgQwC-eOmhDYpsWiSoaQNYqLecifa43jvOV6FVc4LXT_laQsyih10KK0whkVfdWNzWUo';
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + accessToken
    };
    //FIXME: see https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
    axios.get('https://api.spotify.com/v1/playlists/' + playlistId + '/tracks', {
      params: {
        'fields': 'items(track(id))',
        'offset': 0
      }
    }).then((response) => {
      console.log(response.data);
    });
  },
  // More APIs, I mean our APIs that can be directly called in Viz page
};

export default dataProvider;
