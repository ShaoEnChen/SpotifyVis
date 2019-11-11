import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import HomeNav from './HomeNav';
import VisualNav from './VisualNav';

class Navbar extends React.Component {
  render() {
    const { classes, location, history } = this.props;
    return (
      <AppBar position="fixed" className={ classes.appBar }>
        <Toolbar className={ classes.toolbar }>
          <Typography
            variant="h6" color="inherit" className={ classes.title }
            component={ Link } to="/">
            SpotifyViz
          </Typography>
          {
            location === '/' ?
              <HomeNav history={history} /> :
              <VisualNav history={history} />
          }
        </Toolbar>
      </AppBar>
    );
  }
}

const styles = (theme) => {
  return ({
    toolbar: {
			justifyContent: 'space-between'
		},
    title: {
			textDecoration: 'none'
    },
    appBar: {
			zIndex: theme.zIndex.drawer + 100
		}
  });
};

export default withStyles(styles)(Navbar);
