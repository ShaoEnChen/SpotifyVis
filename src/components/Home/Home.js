import React from 'react';
import { withStyles, ThemeProvider } from '@material-ui/styles';
import Navbar from '../Navbar/Navbar';
import Jumbotron from './Jumbotron';
import theme from '../../helper/theme';

class Home extends React.Component {
  render() {
    const path = this.props.location.pathname;

    return (
      <ThemeProvider theme={ theme }>
        <Navbar location={ path } />
        <Jumbotron />
      </ThemeProvider>
    );
  }
}

const styles = (theme) => {
  return ({
    
  })
};

export default withStyles(styles)(Home);
