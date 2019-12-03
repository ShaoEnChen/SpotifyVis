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
    const {
      classes, location, history,
      similarityAlgorithm, setAlgorithm,
      xAxisFeature, yAxisFeature, setAxisFeatures,
      genresDictionary, genresFilter, toggleGenre
    } = this.props;
    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6" color="inherit" className={classes.title}
            component={Link} to="/">
            SpotiViz
          </Typography>
          {
            location === '/' ?
              <HomeNav history={history} /> :
              <VisualNav
                history={history}
                similarityAlgorithm={similarityAlgorithm}
                setAlgorithm={setAlgorithm}
                xAxisFeature={xAxisFeature}
                yAxisFeature={yAxisFeature}
                setAxisFeatures={setAxisFeatures}
                genresDictionary={genresDictionary}
                genresFilter={genresFilter}
                toggleGenre={toggleGenre} />
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
