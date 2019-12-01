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

  zoomed(context, transform, paths) {
    const zoomScale = transform.k;
    const radius = 5 * zoomScale;
    const tracks = this.props.tracks;
    paths.length = 0;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    if (zoomScale < 2.5) {
      for (let trackIndex in tracks) {
        let path = new Path2D();
        let position = this.rescale(context, tracks[trackIndex].position);
        const [x, y] = transform.apply(position);
        path.moveTo(x + radius, y);
        path.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill(path);
        paths.push(path);
      }

    } else {
      for (let trackIndex in tracks) {
        let position = this.rescale(context, tracks[trackIndex].position);
        const [x, y] = transform.apply(position);
        context.fillText(tracks[trackIndex].songName, x, y);
      }
    }

    return paths;
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

    const canvas = d3.select(context).select('canvas').empty() ?
                    d3.select(context)
                      .append('canvas')
                      .attr('width', canvasWidth)
                      .attr('height', canvasHeight) :
                    d3.select(context).select('canvas');

    const ctx = canvas.node().getContext('2d');

    let paths = [];
    const zoomSetting = d3.zoom()
                          .scaleExtent([1, 8])
                          .on('zoom', () => {
                            this.zoomed(ctx, d3.event.transform, paths);
                          });

    d3.select(ctx.canvas).call(zoomSetting);
    
    // Initiate drawing on scale 1
    this.zoomed(ctx, d3.zoomIdentity, paths);
    
    // Zoom out to scale when clicked
    canvas.on('click', () => {
      this.reset(canvas, zoomSetting);
    });

    let lastPathMouseOn = null;
    canvas.on('mousemove', () => {
      const [mouseX, mouseY] = d3.mouse(canvas.node());
      let newPathFound = false;

      // If mouse is on the last path, then no-op
      if (!lastPathMouseOn || !ctx.isPointInPath(lastPathMouseOn, mouseX, mouseY)) {
        for (let path of paths) {
          if(ctx.isPointInPath(path, mouseX, mouseY)) {
            newPathFound = true;
            if (lastPathMouseOn) {
              ctx.fillStyle = '#000';
              ctx.fill(lastPathMouseOn);
            }

            lastPathMouseOn = path;
            ctx.fillStyle = '#ff0000';
            ctx.fill(path);
            break;
          };
        }
        if (!newPathFound && lastPathMouseOn) {
          ctx.fillStyle = '#000';
          ctx.fill(lastPathMouseOn);
          lastPathMouseOn = null;
        }
      }
    });
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

  render() {
    const { classes } = this.props;
    if (this.props.tracks && this.props.tracks[0].position) {
      this.createViz();
    }
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