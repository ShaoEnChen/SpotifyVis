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

  spotifyPost() {
    // do something
  }

  componentDidMount() {
    this.spotifyPost();
  }

  render() {
    const path = this.props.location.pathname;
    let locations = dataProvider.createRandomLocations();

    return (
      <ThemeProvider theme={ theme }>
        <Navbar location={ path } />
        <VisualDrawer />
        <SongsViz songs={locations} />
      </ThemeProvider>
    );
  }
}

export default Visual;
