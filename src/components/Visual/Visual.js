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
