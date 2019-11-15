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
    const accessToken = 'BQCJ_Qbe4MzEAB0Y8kXdyR-a0vVkS8fHWF1kFagSXALntNq0v8aLjTR1W6lS8ff0FyoNSm5EFtL2-m-UteM';
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

  //Retrieves the total number of songs that we're going to need to grab.
  //FIXME: how do you store this data in react?
  //RESPONSE: if you want to store data into State, these two method might need to be moved to VisuaL.js
  spotifyGetPlaylistTrackCount: (accessToken,playlistId) => {
    // const accessToken = 'BQCfKhrq3XYcgVosRQwoLK1A6quNiA1CdC06tV7DzWX_dbeHkdekNbNagY6VSbTVSkICIQEkHz_lhlkBV3o';
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
  spotifyGetPlaylistPage: (accessToken,playlistId) => {
    // const accessToken = 'BQCfKhrq3XYcgVosRQwoLK1A6quNiA1CdC06tV7DzWX_dbeHkdekNbNagY6VSbTVSkICIQEkHz_lhlkBV3o';
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
