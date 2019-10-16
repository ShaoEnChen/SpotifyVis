import React from 'react';
import { withStyles, ThemeProvider } from '@material-ui/styles';
import Navbar from '../Navbar/Navbar';
import theme from '../../theme';

class Home extends React.Component {
  render() {
    const path = this.props.location.pathname;

    return (
      <ThemeProvider theme={ theme }>
        <Navbar location={ path } />
      </ThemeProvider>
    );
  }
}

const styles = (theme) => {

};

export default withStyles(styles)(Home);
