import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import Navbar from '../Navbar/Navbar';
import Jumbotron from './Jumbotron';
import theme from '../../helper/theme';

class Home extends React.Component {
  render() {
    const { location, history } = this.props;
    const path = location.pathname;

    return (
      <ThemeProvider theme={theme}>
        <Navbar location={path} history={history} />
        <Jumbotron history={history} />
      </ThemeProvider>
    );
  }
}

export default Home;
