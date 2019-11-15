import React from 'react';
import axios from 'axios';
import qs from 'qs';
import SpotifyWebApi from 'spotify-web-api-js';
import { ThemeProvider } from '@material-ui/styles';
import Navbar from '../Navbar/Navbar';
import VisualDrawer from './VisualDrawer';
import SongsViz from './SongsViz';
import theme from '../../helper/theme';
import ApiProvider from '../../helper/ApiProvider';

class Visual extends React.Component {

  constructor() {
    super();
    this.state = {
      playlist_batch_index: 0
    };
  }

  componentDidMount() {
    //Flow :
    //AccessToken, playListId -> tracks, tracksArray -> tracks audio features
    //Use Javascript Promise object to concatenate response and step by step
    //store result into State

    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    const spotifyApi = new SpotifyWebApi({ clientId, clientSecret });

    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('pl');

    const cors_url = 'https://cors-anywhere.herokuapp.com/';
    const api_url = 'https://accounts.spotify.com/api/token';
    const request_url = cors_url + api_url;
    const bodyParameters = {
      grant_type: 'client_credentials',
      refresh_token: process.env.REACT_APP_REFRESH_TOKEN
    };
    const basicAuth = 'Basic ' + btoa(clientId + ':' + clientSecret);

    // First, get the access token for tracks retrieval afterwards
    axios.post(request_url, qs.stringify(bodyParameters), {
      headers: {
        'Authorization': basicAuth,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      const accessToken = response.data.access_token;
      return accessToken;

      // Then, we get the tracks in the playlist and their audio features.
      // As Spotify has a maximum batch size of 100 songs/request,
      // TODO: we have to send this request multiple times to get all tracks.
    }).then((accessToken) => {
      ApiProvider.spotifyGetTracksAndAudioFeatures(spotifyApi, accessToken, playlistId, this);
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { location, history } = this.props;
    const path = location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('pl');

    //For test
    const songs = ApiProvider.createRandomSongs();
    console.log(this.state);

    return (
      <ThemeProvider theme={theme}>
        <Navbar location={path} history={history} />
        <VisualDrawer playlistId={playlistId} />
        <SongsViz songs={songs} />
      </ThemeProvider>
    );
  }
}

export default Visual;
