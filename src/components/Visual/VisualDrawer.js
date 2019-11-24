import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/styles';

class VisualDrawer extends React.Component {
  render() {
    const { classes, playlistId } = this.props;
    const playlistUrl = 'https://open.spotify.com/embed/playlist/' + playlistId;

    return (
      <Hidden xsDown implementation="css">
        <Drawer
          open
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent">
          <div className={classes.toolbarIndent}></div>
          <iframe title="playlist"
            src={playlistUrl}
            className={classes.playlist}
            allow="encrypted-media" />
        </Drawer>
      </Hidden>
    );
  }
}

const styles = (theme) => {
  return ({
    drawer: {
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
        width: theme.drawerWidth,
        flexShrink: 0
      }
    },
    toolbarIndent: theme.mixins.toolbar,
    drawerPaper: {
      width: theme.drawerWidth
    },
    playlist: {
      width: theme.drawerWidth,
      height: '100vh'
    }
  });
};

export default withStyles(styles)(VisualDrawer);
