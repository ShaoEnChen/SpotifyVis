import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/styles';

class VisualDrawer extends React.Component {

  constructor() {
    super();
    this.state = {
      mobileOpen: false
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {/* { Mobile Menu } */}
        <Hidden xsDown implementation="css">
          <Drawer
            open
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent">
            <div className={classes.toolbarIndent}></div>
            {/* { Spotify Playlist } */}
          </Drawer>
        </Hidden>
      </React.Fragment>
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
    }
  });
};

export default withStyles(styles)(VisualDrawer);
