import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/styles';

const drawerWidth = 240;

class VisualDrawer extends React.Component {

  constructor() {
    super();
    this.state = {
      mobileOpen: false
    };
  }

  render() {
    // props contains all of the parent's properties. can do props.accessToken or similar
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
            {<iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
            className={classes.playlist} allowtransparency="true"
            allow="encrypted-media"></iframe>}
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
        width: drawerWidth,
        flexShrink: 0
      }
    },
    toolbarIndent: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    playlist: {
      width: drawerWidth,
      height: "100vh"
    }
  });
};

export default withStyles(styles)(VisualDrawer);
