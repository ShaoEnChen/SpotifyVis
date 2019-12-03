import React from 'react';
import { withStyles } from '@material-ui/styles';
import PlaylistInput from '../PlaylistInput/PlaylistInput';

class Jumbotron extends React.Component {
  render() {
    const { classes, history } = this.props;
    return (
      <React.Fragment>
        <div className={classes.toolbarIndent}></div>
        <div className={classes.smallPaddingSection}></div>
        <div className={classes.logo}>
        <center>
          <a href="SpotiVizLogo1.png" class="image fit thumb"><img src="SpotiVizLogo1.png" alt="" width="33%" height="auto" /></a>
          </center>
        </div>
        <div className={classes.section}>
          <PlaylistInput history={history} />
        </div>
        <div className={classes.paddingSection}></div>
      </React.Fragment>
    );
  }
}

const styles = (theme) => {
  return ({
    section: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '10vh'
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '30vh',
      padding: '5vh'
    },
    paddingSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '15vh'
    },
    smallPaddingSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10vh'
    },
    toolbarIndent: theme.mixins.toolbar
  });
};

export default withStyles(styles)(Jumbotron);
