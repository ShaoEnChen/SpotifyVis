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
    this.state = {
      response: null,
      index: 0,
      limit: 0,
      songs: {},
      accessToken: null,
      playlistId: null,
      tracks: null,     //List of songName, artist, album
      tracksArr:null,   //List of songId (Used for audio features API)
      tracksAudioFeatures:null  //List of songs audio features
    };
  }

  componentDidMount() {
    //Flow :
    //AccessToken, playListId -> tracks, tracksArray -> tracks audio features
    //Use Javascript Promise object to concatenate response and step by step
    //store result into State
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
      //Save AccessToken into State
      this.setState({accessToken:response.data.access_token});
      const { location, history } = this.props;
      const path = location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      const playlistId = urlParams.get('pl');
      //Save playlistId into State
      this.setState({playlistId:playlistId});
      return playlistId;

    }).then((playlistId)=>{

        let SpotifyWebApi = require('spotify-web-api-js');
        let spotifyApi = new SpotifyWebApi({
          clientId: 'd83740bfd39e48cd9e1cee53425b375b',
          clientSecret: 'eeb7bd011f2d41a0a0284a37a296cbf6'
        });
        spotifyApi.setAccessToken(this.state.accessToken);
        spotifyApi.getPlaylistTracks(playlistId)
        .then((data) => {

          let tracks = [];
          let tracksArr = [];

          data.items.forEach(function (arrayItem) {
              let track = {};
              track.songName = arrayItem.track.name;
              track.id = arrayItem.track.id;
              track.artist = arrayItem.track.artists;
              track.album = arrayItem.track.album;
              tracks.push(track);
              tracksArr.push(track.id);

          });
          //Save tracks, tracksArr into State
          this.setState({tracks : tracks});
          this.setState({tracksArr : tracksArr});
          return tracksArr;

        }).then((tracksArr)=>{
          let SpotifyWebApi = require('spotify-web-api-js');
          let spotifyApi = new SpotifyWebApi({
            clientId: 'd83740bfd39e48cd9e1cee53425b375b',
            clientSecret: 'eeb7bd011f2d41a0a0284a37a296cbf6'
          });
          spotifyApi.setAccessToken(this.state.accessToken);
          spotifyApi.getAudioFeaturesForTracks(tracksArr).then(
            (data)=> {
              //Save tracks Audio Features into State
              this.setState({tracksAudioFeatures:data.audio_features})
            },
            function(err) {
              console.error(err);
            });
        });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { location, history } = this.props;
    const path = location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('pl');
    const playlistUrl = 'https://open.spotify.com/embed/playlist/' + playlistId;
    const songs = dataProvider.createRandomSongs();

    //Ben's Part
    if(this.state.accessToken!=null && this.state.playlistId!=null){
      dataProvider.spotifyGetPlaylistTrackCount(this.state.accessToken,this.state.playlistId);
      dataProvider.spotifyGetPlaylistPage(this.state.accessToken,this.state.playlistId);
    }

      //For test
      console.log("playlistId",this.state.playlistId);
      console.log("Tracks in Render: ", this.state.tracks);
      console.log("TracksArray: ", this.state.tracksArr);
      console.log("TracksAudioFeatures: ", this.state.tracksAudioFeatures);

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
