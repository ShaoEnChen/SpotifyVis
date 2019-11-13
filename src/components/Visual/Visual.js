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
      index: 0,
      limit: 0,
      songs: {}
    };
  }

  // componentDidMount() {
  //   do axios, set state
  // }

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
