import React from 'react';
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import * as d3 from 'd3';

class SongsViz extends React.Component {

  constructor(props) {
    super(props);
    this.indent = React.createRef();
    this.viz = React.createRef();
    this.state = {
      canvasColor: {
        normal: '#fff',
        highlight: '#1ed761'
      }
    };
  }

  rescale(context, position) {
    const originalX = position[0];
    const originalY = position[1];
    const x = originalX / 100 * context.canvas.width;
    const y = context.canvas.height - originalY / 100 * context.canvas.height;
    return [x, y];
  }

  zoomed(context, transform, drawnTracks) {
    const zoomScale = transform.k;
    const zoomThreshold = 2;
    const radius = 5 * zoomScale;
    const tracks = this.props.tracks;
    drawnTracks.length = 0;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let trackIndex in tracks) {
      const track = tracks[trackIndex];
      const path = new Path2D();
      const position = this.rescale(context, track.position);
      const [x, y] = transform.apply(position);

      context.globalAlpha = zoomScale > zoomThreshold ? 0 : 1;
      context.fillStyle = this.state.canvasColor.normal;
      path.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill(path);
      context.globalAlpha = 1;

      if (zoomScale > zoomThreshold) {
        context.fillStyle = this.state.canvasColor.normal;
        context.fillText(tracks[trackIndex].songName, x, y);
      }

      drawnTracks.push({
        path,
        position: [x, y],
        songName: track.songName,
        artists: track.artists.map(artist => artist.name),
        album: track.album.name,
        genres: track.genres,
        zoomScale
      });
    }

    return drawnTracks;
  }

  createViz = () => {
    const indent = this.indent.current;
    const viz = this.viz.current;
    const contextHeight = window.innerHeight - indent.offsetHeight;
    const contextPadding = {
      top: 10,
      bottom: 10
    };
    const canvasHeight = contextHeight - contextPadding.top - contextPadding.bottom;
    const canvasWidth = viz.offsetWidth;

    const staticCanvas = d3.select(viz)
      .select('#static')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight);

    const dynamicCanvas = d3.select(viz)
      .select('#dynamic')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight);

    const canvasColor = this.state.canvasColor;
    const staticContext = staticCanvas.node().getContext('2d');
    const dynamicContext = dynamicCanvas.node().getContext('2d');

    let drawnTracks = [];
    let lastTrackMouseOn = null;
    const zoomSetting = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', () => {
        staticContext.fillStyle = canvasColor.normal;
        lastTrackMouseOn = null;
        dynamicContext.clearRect(0, 0, canvasWidth, canvasHeight);
        this.zoomed(staticContext, d3.event.transform, drawnTracks);
      });

    d3.select(dynamicContext.canvas).call(zoomSetting);

    // Initiate drawing on scale 1
    this.zoomed(staticContext, d3.zoomIdentity, drawnTracks);

    dynamicCanvas.on('mousemove', () => {
      const [mouseX, mouseY] = d3.mouse(dynamicCanvas.node());
      let newPathFound = false;
      let currentZoomScale;
      const zoomThreshold = 2;

      // If mouse is on the last path, then no-op
      // If no previous record or mouse not on the last path, then:
      if (!lastTrackMouseOn || !staticContext.isPointInPath(lastTrackMouseOn.path, mouseX, mouseY)) {
        for (let track of drawnTracks) {
          currentZoomScale = track.zoomScale;

          if (staticContext.isPointInPath(track.path, mouseX, mouseY)) {
            newPathFound = true;
            if (lastTrackMouseOn) {
              // Remove previous highlight
              staticContext.globalAlpha = currentZoomScale > zoomThreshold ? 0 : 1;
              staticContext.fillStyle = canvasColor.normal;
              staticContext.fill(lastTrackMouseOn.path);
              staticContext.globalAlpha = 1;
              dynamicContext.clearRect(0, 0, canvasWidth, canvasHeight);
            }

            // Highlight current drawnTrack
            lastTrackMouseOn = track;
            staticContext.globalAlpha = currentZoomScale > zoomThreshold ? 0 : 1;
            staticContext.fillStyle = canvasColor.highlight;
            staticContext.fill(track.path);
            staticContext.globalAlpha = 1;

            const fontSize = 12;
            const lineSpace = 4;
            const textX = track.position[0] + 12 * currentZoomScale;
            const textY = track.position[1] - 5 * currentZoomScale;
            
            let maxTextLength = 0;
            const songNameText = track.songName;
            maxTextLength = Math.max(maxTextLength, songNameText.length);
            
            const artistsText = 'Artists: ' + track.artists.reduce((str, artist) => str + artist + ', ', '').slice(0, -2);
            maxTextLength = Math.max(maxTextLength, artistsText.length);

            const albumText = 'Album: ' + track.album;
            maxTextLength = Math.max(maxTextLength, albumText.length);
            
            const genresText = 'Genres: ' + track.genres.reduce((str, genre) => str + genre + ', ', '').slice(0, -2);
            maxTextLength = Math.max(maxTextLength, genresText.length);

            const textRectPadding = 4;
            const textRectWidth = maxTextLength * fontSize / 2 + textRectPadding;
            const textRectHeight = 4 * fontSize + 3 * lineSpace  + 3 * textRectPadding;
            dynamicContext.fillStyle = '#000';
            dynamicContext.fillRect(textX - textRectPadding, textY - fontSize - textRectPadding, textRectWidth, textRectHeight);

            dynamicContext.fillStyle = canvasColor.highlight;
            dynamicContext.font = fontSize + 'px Arial';
            dynamicContext.fillText(
              songNameText,
              textX,
              textY
            );
            dynamicContext.fillText(
              artistsText,
              textX,
              textY + fontSize + lineSpace
            );
            dynamicContext.fillText(
              albumText,
              textX,
              textY + 2 * (fontSize + lineSpace)
            );
            dynamicContext.fillText(
              genresText,
              textX,
              textY + 3 * (fontSize + lineSpace)
            );
            break;
          };
        }
        // Not on any path, clear settings
        if (!newPathFound && lastTrackMouseOn) {
          staticContext.globalAlpha = currentZoomScale > zoomThreshold ? 0 : 1;
          staticContext.fillStyle = canvasColor.normal;
          staticContext.fill(lastTrackMouseOn.path);
          staticContext.globalAlpha = 1;
          lastTrackMouseOn = null;
          dynamicContext.clearRect(0, 0, canvasWidth, canvasHeight);
        }
      }

      // Zoom out to scale when clicked
      dynamicCanvas.on('click', () => {
        staticContext.fillStyle = canvasColor.normal;
        lastTrackMouseOn = null;
        dynamicContext.clearRect(0, 0, canvasWidth, canvasHeight);
        this.reset(dynamicCanvas, zoomSetting);
      });
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

    if (this.props.tracks && this.props.tracks.length > 0 && this.props.tracks[0].position) {
      this.createViz();
    }
    return (
      <Container className={classes.container}>
        <div ref={this.indent} className={classes.toolbarIndent}></div>
        <div ref={this.viz} className={classes.context}>
          <canvas id="dynamic" className={classes.dynamicCanvas}></canvas>
          <canvas id="static" className={classes.staticCanvas}></canvas>
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
      maxWidth: '100%',
      height: '100vh',
      marginLeft: theme.drawerWidth,
      backgroundColor: '#111'
    },
    context: {
      display: 'flex',
      position: 'relative',
      paddingTop: '10px',
      paddingBottom: '10px'
    },
    staticCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 0
    },
    dynamicCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1
    }
  });
};

export default withStyles(styles)(SongsViz);