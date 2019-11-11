import React from 'react';
import { withStyles } from '@material-ui/styles';
import PlaylistInput from '../PlaylistInput/PlaylistInput';

class Jumbotron extends React.Component {
  render() {
    const { classes, history } = this.props;
    return (
      <React.Fragment>
        <div className={classes.toolbarIndent}></div>
        <div className={classes.section}>
          <PlaylistInput history={history} />
        </div>
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
      height: '80vh'
    },
    toolbarIndent: theme.mixins.toolbar
  });
};

export default withStyles(styles)(Jumbotron);