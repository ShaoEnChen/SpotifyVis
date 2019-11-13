import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import Navbar from '../Navbar/Navbar';
import VisualDrawer from './VisualDrawer';
import theme from '../../helper/theme';
import dataProvider from '../../helper/dataProvider';
import SongsViz from './SongsViz';
import axios from 'axios';
import qs from 'qs';

class Visual extends React.Component {

  constructor() {
    super();
    console.log("hit");
    this.state = {
      response: null,
      accessToken :null,
      playlistId :null,
      tracks:null
    };
  }

  parsePlaylistId(){

    let str = window.location.search;
    let res = str.split("/");
    // console.log(res[5]);
    let playlistid = res[5].split("?");
    this.setState({playlistId:playlistid[0]});
  }


  spotifyGetAccessToken() {
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

      this.setState({accessToken:response.data.access_token});

    }).catch((error) => {
      console.log(error);
    });
  }

  onComplete(input){
    console.log(" On completes");
    // this.setState({tracks : input});
  }


  spotifyGetTracksViaPlaylist(whenDone){
    let SpotifyWebApi = require('spotify-web-api-js');

    let spotifyApi = new SpotifyWebApi({
      clientId: 'd83740bfd39e48cd9e1cee53425b375b',
      clientSecret: 'eeb7bd011f2d41a0a0284a37a296cbf6'
    });
    // spotifyApi.setAccessToken('BQBr8zoFUITS3oe7Ex1oCo4BOb-dW5J0_fCVf-t3jVlBGEKLEqs2g1JkNdd-qDcCvI4cpoVxF8m5RCZncL8');
    // spotifyApi.getPlaylistTracks('5ORlAqcF4dhRbEgs7ohRn8')

    spotifyApi.setAccessToken(this.state.accessToken);
    spotifyApi.getPlaylistTracks(this.state.playlistId)
    .then((data) => {

      let tracks = [];

      console.log('Tracks: ', data.items);



      data.items.forEach(function (arrayItem) {
          var x = arrayItem.track;
          // console.log(x);
          let track = {}
          track.songName = arrayItem.track.name;
          track.id = arrayItem.track.id;
          track.artist = arrayItem.track.artists;
          track.album = arrayItem.track.album;
          tracks.push(track);
          // return tracks;

      });
      console.log(tracks);
      this.setState({tracks : tracks});
      whenDone(tracks);
    }, function(err) {
      console.error(err);
    });
    // console.log(tracks);
    // this.setState({tracks : "AAA"});
  }

  spotifyGetAudioFeatures(){
    let SpotifyWebApi = require('spotify-web-api-js');

    let spotifyApi = new SpotifyWebApi({
      clientId: 'd83740bfd39e48cd9e1cee53425b375b',
      clientSecret: 'eeb7bd011f2d41a0a0284a37a296cbf6'
    });
    spotifyApi.setAccessToken(this.state.accessToken);
    // spotifyApi.setAccessToken('BQCcvlRQpsbWfBUOfFd6sUWGIz5k3s1rcev6zO4zpjDyoYwJLvM2Ma5w7L3QQD_HlztLs_NZ8c6VI6Um0N4');
    var array= ['4JpKVNYnVcJ8tuMKjAj50A','2NRANZE9UCmPAS5XVbXL40','24JygzOLM0EmRQeGtFcIcG']
    spotifyApi.getAudioFeaturesForTracks(array).then(
      function(data) {
        console.log('Audio Features for tracks : ', data.audio_features);
      },
      function(err) {
        console.error(err);
      }
      );
  }

  componentDidMount() {
    this.spotifyGetAccessToken() ;
    this.parsePlaylistId();
  }

  render() {
    const { location, history } = this.props;
    const path = location.pathname;
    const urlParams = new URLSearchParams(window.location.search);

    const playlistId = urlParams.get('pl');
    const playlistUrl = 'https://open.spotify.com/embed/playlist/' + playlistId;
    const songs = dataProvider.createRandomSongs();
    dataProvider.spotifyPost();
    //dataProvider.spotifyGet();
    dataProvider.spotifyGetPlaylistTrackCount(playlistId);
    dataProvider.spotifyGetPlaylistPage(playlistId);


    if(this.state.accessToken != null && this.state.playlistId!=null){
      // this.spotifyGetAudioFeatures();
      console.log("Yes token: "+this.state.accessToken );
      console.log("playlistId: "+this.state.playlistId );

      // Let's get audioFeatures
      this.spotifyGetTracksViaPlaylist(this.onComplete);

      if(this.state.tracks!=null){
        console.log("Here:"+this.state.tracks);
      }
      this.spotifyGetAudioFeatures();

    }else{
      console.log("No token");
    }

    return (
      <ThemeProvider theme={theme}>
        <Navbar location={path} history={history} />
        <VisualDrawer playlistUrl={playlistUrl} />
        <SongsViz songs={songs} />
      </ThemeProvider>
    );
  }
}

export default Visual;
