import React from 'react';
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import d3 from 'd3';

class SongsViz extends React.Component {

  componentDidMount() {
    // const ctx = this.refs.context;
    // const contextWidth = ctx.offsetWidth;
    // const contextHeight = ctx.offsetHeight;
    // const context = DOM.context2d(contextWidth, contextHeight);
    // console.log(context)
  }

  render() {
    console.log(this.props.songs);
    const { classes } = this.props;
    return (
      <Container className={classes.container}>
        <div className={classes.toolbarIndent}></div>
        <div ref='context' className={classes.vizCanvas}>
          <button>Click!</button>
        </div>
      </Container>
    );
  }
}

const styles = (theme) => {
  return ({
    toolbarIndent: theme.mixins.toolbar,
    container: {
      width: 'calc(100vw - ' + theme.drawerWidth + 'px)',
      height: '100vh',
      marginLeft: theme.drawerWidth
    },
    vizCanvas: {
      width: '100%',
      height: '100%'
    }
  });
};

export default withStyles(styles)(SongsViz);