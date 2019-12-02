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
      similarityAlgorithm: 'PCA',
      xAxisFeature: null,
      yAxisFeature: null
    };
  }

  setAlgorithm(algorithm) {
    this.setState({ similarityAlgorithm: algorithm }, () => {
      ApiProvider.getSongsCanvasPosition(this);
    });
  }

  setAxisFeatures(xFeature, yFeature) {
    this.setState({
      xAxisFeature: xFeature,
      yAxisFeature: yFeature
    }, () => {
      ApiProvider.getSongsCanvasPosition(this);
    });
  }

  getGenresFilteredTracks() {
    const tracks = this.state.tracks;
    const genresFilter = this.state.genresFilter;
    if (!tracks || !genresFilter) {
      return;
    }

    let filteredTracks = [];
    for (const track of tracks) {
      let shouldAddTrack = true;
      for (const genre of track.genres) {
        if (genresFilter[genre] === false) {
          shouldAddTrack = false;
          break;
        }
      }
      if (shouldAddTrack) {
        filteredTracks.push(track);
      }
    }
    return filteredTracks;
  }

  toggleGenre(toggledGenre) {
    let genresFilter = this.state.genresFilter;
    genresFilter[toggledGenre] = !genresFilter[toggledGenre];
    
    let genresDictionary = this.state.genresDictionary;
    for (const genre in genresDictionary) {
      genresDictionary[genre] = 0;
    }

    const tracks = this.state.tracks;
    for (const track of tracks) {
      let shouldCountTrack = true;
      for(const genre of track.genres) {
        if (genresFilter[genre] === false) {
          shouldCountTrack = false;
          break;
        }
      }
      if (shouldCountTrack) {
        track.genres.forEach((genre) => {
          if (!(genre in genresDictionary)) {
            genresDictionary[genre] = 1;
          } else {
            genresDictionary[genre] += 1;
          }
        });
      }
    }
    
    this.setState({
      genresDictionary,
      genresFilter
    });
  }

  componentDidMount() {
    // Flow :
    // AccessToken, playListId -> tracks, tracksArray -> tracks audio features
    // Use Javascript Promise object to concatenate response and step by step
    // store result into State

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
      this.setState({
        accessToken: response.data.access_token
      });

      // Then, we get the tracks in the playlist and their audio features.
      // As Spotify has a maximum batch size of 100 songs/request,
      // TODO: we have to send this request multiple times to get all tracks.
    }).then(() => {
      ApiProvider.spotifyGetTracksAndAudioFeatures(spotifyApi, playlistId, this);

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
    console.log(this.state);

    return (
      <ThemeProvider theme={theme}>
        <Navbar
          location={path}
          history={history}
          similarityAlgorithm={this.state.similarityAlgorithm}
          setAlgorithm={this.setAlgorithm.bind(this)}
          xAxisFeature={this.state.xAxisFeature}
          yAxisFeature={this.state.yAxisFeature}
          setAxisFeatures={this.setAxisFeatures.bind(this)}
          genresDictionary={this.state.genresDictionary}
          genresFilter={this.state.genresFilter}
          toggleGenre={this.toggleGenre.bind(this)} />
        <VisualDrawer playlistId={playlistId} />
        <SongsViz tracks={this.getGenresFilteredTracks()} />
      </ThemeProvider>
    );
  }
}

export default Visual;
