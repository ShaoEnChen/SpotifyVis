import React from 'react';
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import * as d3 from 'd3';

class SongsViz extends React.Component {

  constructor(props) {
    super(props);
    this.indent = React.createRef();
    this.viz = React.createRef();
  }

  rescale(context, position) {
    const originalX = position[0];
    const originalY = position[1];
    const x = originalX / 100 * context.canvas.width;
    const y = originalY / 100 * context.canvas.height;
    return [x, y];
  }

  zoomed(context, transform) {
    const zoomScale = transform.k;
    const radius = 5 * zoomScale;
    const songs = this.props.songs;

    context.save();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    for (const songIndex in songs) {
      let position = this.rescale(context, songs[songIndex].position);
      const [x, y] = transform.apply(position);
      context.moveTo(x + radius, y);
      context.arc(x, y, radius, 0, 2 * Math.PI);
    }
    context.fill();
    context.restore();
  }

  reset = (canvas, zoomSetting) => {
    const ctx = canvas.node().getContext('2d');
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    canvas.transition().duration(500).call(
      zoomSetting.transform,
      d3.zoomIdentity,
      d3.zoomTransform(canvas.node()).invert([width / 2, height / 2])
    );
  }

  createViz = () => {
    const indent = this.indent.current;
    const context = this.viz.current;
    const contextHeight = window.innerHeight - indent.offsetHeight;
    const contextPadding = {
      top: 10,
      bottom: 10
    };
    const canvasHeight = contextHeight - contextPadding.top - contextPadding.bottom;
    const canvasWidth = context.offsetWidth;
    const canvas = d3.select(context)
                    .append('canvas')
                    .attr('width', canvasWidth)
                    .attr('height', canvasHeight);

    const ctx = canvas.node().getContext('2d');
    const zoomSetting = d3.zoom()
                          .scaleExtent([1, 8])
                          .on('zoom', () => {
                            this.zoomed(ctx, d3.event.transform);
                          });

    d3.select(ctx.canvas).call(zoomSetting);

    // Zoom out to scale when clicked
    canvas.on('click', () => {
      this.reset(canvas, zoomSetting);
    });

    // Initial drawing on scale 1
    this.zoomed(ctx, d3.zoomIdentity);
  }

  componentDidMount() {
    this.createViz();
  }

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.container}>
        <div ref={this.indent} className={classes.toolbarIndent}></div>
        <div ref={this.viz} className={classes.context}></div>
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
    context: {
      display: 'flex',
      paddingTop: '10px',
      paddingBottom: '10px'
    }
  });
};

export default withStyles(styles)(SongsViz);