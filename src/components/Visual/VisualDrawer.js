import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
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
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Hidden smUp implementation="css">
          <Drawer variant="temporary"
            open={ this.state.mobileOpen }
            onClose={ () => { this.setState({ mobileOpen: !this.state.mobileOpen }) } }
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              // Better open performance on mobile devices
              keepMounted: true
            }}>
            <div className={ classes.toolbarIndent }></div>
            <Divider />
            {/* { Spotify Playlist } */}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            open
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent">
            <div className={ classes.toolbarIndent }></div>
            {/* { Spotify Playlist } */}
          </Drawer>
        </Hidden>
      </React.Fragment>
    );
  }
}

const styles = (theme) => {
  return ({
    root: {
      display: 'flex'
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolbarIndent: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      
    }
  });
};

export default withStyles(styles)(VisualDrawer);
