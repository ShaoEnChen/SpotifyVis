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
      response: null
    };
  }

  // componentDidMount() {
  //   do axios, set state
  // }

  render() {
    const { location, history } = this.props;
    const path = location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const playlistUrl = urlParams.get('pl');
    const songs = dataProvider.createRandomSongs();
    //const data = [{'tempo': 40, 'energy': 50, 'valence': 60}, {'tempo': 50, 'energy': 70, 'valence': 60}, {'tempo': 80, 'energy': 70, 'valence': 90}, {'tempo': 50, 'energy': 60, 'valence': 80}];
    //const songNames = ['songName1', 'songName2', 'songName3', 'songName4'];
    //const songs = dataProvider.createDataByPCA(data, songNames);
    //const songs = dataProvider.createDataByVariance(data, songNames);
    //const songs = dataProvider.createDataBySelection(data, songNames, 'tempo', 'energy');
    //console.log(songs);
    console.log(playlistUrl);
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
