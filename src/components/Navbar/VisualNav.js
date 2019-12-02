import React from 'react';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PlaylistInput from '../PlaylistInput/PlaylistInput';

class VisualNav extends React.Component {
  constructor() {
    super();
    this.state = {
      algorithmDropdownElement: null,

      featuresSelectionShow: false,
      xSelection: null,
      xAxisDropdownElement: null,
      ySelection: null,
      yAxisDropdownElement: null,

      genresDropdownElement: null
    };
  }

  handleDropdownOpen = (event, state) => {
    this.setState({ [state]: event.currentTarget });
  }

  handleDropdownClose = (stateKey) => {
    this.setState({ [stateKey]: null });
  }

  setAlgorithmOnMenu = (algorithm) => {
    const { setAlgorithm } = this.props;
    setAlgorithm(algorithm);
    this.setState({ featuresSelectionShow: algorithm === 'Customed' });
    this.handleDropdownClose('algorithmDropdownElement');
  }

  setAxisFeaturesOnMenu = (axis, feature) => {
    const { setAxisFeatures } = this.props;
    let dropdownElement, selectionKey;
    if (axis === 'x') {
      dropdownElement = 'xAxisDropdownElement';
      selectionKey = 'xSelection';
      setAxisFeatures(feature, this.state.ySelection);
    } else {
      dropdownElement = 'yAxisDropdownElement';
      selectionKey = 'ySelection';
      setAxisFeatures(this.state.xSelection, feature);
    }
    this.setState({ [selectionKey]: feature });
    this.handleDropdownClose(dropdownElement);
  }

  getFeatureOptions(axis) {
    const features = [
      'acousticness',
      'danceability',
      'energy',
      'instrumentalness',
      'liveness',
      'loudness',
      'speechiness',
      'tempo',
      'valence'
    ];
    let options = features.map((feature) => {
      return (
        <MenuItem key={feature} onClick={() => { this.setAxisFeaturesOnMenu(axis, feature); }}>
          {feature}
        </MenuItem>
      );
    });
    return options;
  }

  getGenreOptions() {
    const { genresFilter } = this.props;
    if (!genresFilter) {
      return;
    }

    let options = Object.keys(genresFilter).map((genre) => {
      return (
        <MenuItem key={genre} onClick={() => {
          this.props.toggleGenre(genre);
          this.handleDropdownClose('genresDropdownElement');
        }}>
          {genre}
        </MenuItem>
      );
    });
    return options;
  }

  render() {
    const { classes, history, similarityAlgorithm, xAxisFeature, yAxisFeature } = this.props;

    return (
      <React.Fragment>
        {/* Options of Similarity Algorithms */}
        <Button
          aria-controls="algorithm-menu"
          aria-haspopup="true"
          onClick={(e) => this.handleDropdownOpen(e, 'algorithmDropdownElement')}
          className={classes.button}>
          Algorithm: {similarityAlgorithm}
        </Button>
        <Menu
          id="algorithm-menu"
          getContentAnchorEl={null}
          anchorEl={this.state.algorithmDropdownElement}
          keepMounted
          open={Boolean(this.state.algorithmDropdownElement)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClose={() => this.handleDropdownClose('algorithmDropdownElement')}>
          <MenuItem onClick={() => { this.setAlgorithmOnMenu('PCA') }}>PCA</MenuItem>
          <MenuItem onClick={() => { this.setAlgorithmOnMenu('Variance') }}>Variance</MenuItem>
          <MenuItem onClick={() => { this.setAlgorithmOnMenu('Customed') }}>Customed</MenuItem>
        </Menu>

        {/* Options of features for customed comparison */}
        {this.state.featuresSelectionShow === true && (
          <React.Fragment>
            <Button
              aria-controls="xAxisFeature-menu"
              aria-haspopup="true"
              onClick={(e) => this.handleDropdownOpen(e, 'xAxisDropdownElement')}
              className={classes.button}>
              X-Axis: {xAxisFeature}
            </Button>
            <Menu
              id="xAxisFeature-menu"
              getContentAnchorEl={null}
              anchorEl={this.state.xAxisDropdownElement}
              keepMounted
              open={Boolean(this.state.xAxisDropdownElement)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              onClose={() => this.handleDropdownClose('xAxisDropdownElement')}>
              {this.getFeatureOptions('x')}
            </Menu>
            <Button
              aria-controls="yAxisFeature-menu"
              aria-haspopup="true"
              onClick={(e) => this.handleDropdownOpen(e, 'yAxisDropdownElement')}
              className={classes.button}>
              Y-Axis: {yAxisFeature}
            </Button>
            <Menu
              id="yAxisFeature-menu"
              getContentAnchorEl={null}
              anchorEl={this.state.yAxisDropdownElement}
              keepMounted
              open={Boolean(this.state.yAxisDropdownElement)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              onClose={() => this.handleDropdownClose('yAxisDropdownElement')}>
              {this.getFeatureOptions('y')}
            </Menu>
          </React.Fragment>
        )}

        {/* Options of Genres Filter */}
        <Button
          aria-controls="genres-menu"
          aria-haspopup="true"
          onClick={(e) => this.handleDropdownOpen(e, 'genresDropdownElement')}
          className={classes.button}>
          Genres
        </Button>
        <Menu
          id="genres-menu"
          getContentAnchorEl={null}
          anchorEl={this.state.genresDropdownElement}
          keepMounted
          open={Boolean(this.state.genresDropdownElement)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClose={() => this.handleDropdownClose('genresDropdownElement')}>
          {this.getGenreOptions()}
        </Menu>

        <PlaylistInput history={history} />
      </React.Fragment>
    );
  }
}

const styles = (theme) => {
  return ({
    button: {
      color: '#fff'
    }
  });
};

export default withStyles(styles)(VisualNav);
