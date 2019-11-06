import React from 'react';
import { withStyles, ThemeProvider } from '@material-ui/styles';
import Navbar from '../Navbar/Navbar';
import VisualDrawer from './VisualDrawer';
import theme from '../../helper/theme';
import dataProvider from '../../helper/dataProvider';

class Visual extends React.Component {
  render() {
    const path = this.props.location.pathname;
    let locations = dataProvider.createRandomLocations();
    console.log(locations);
    // dataProvider.spotifyGet();
    dataProvider.spotifyPost();

    return (
      <ThemeProvider theme={ theme }>
        <Navbar location={ path } />
        <VisualDrawer />
      </ThemeProvider>
    );
  }
}

const styles = (theme) => {

};

export default withStyles(styles)(Visual);
