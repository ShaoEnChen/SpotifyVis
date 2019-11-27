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
      xAxisFeatureDropdownElement: null,
      yAxisFeatureDropdownElement: null
    };
  }

  handleDropdownOpen = (event, state) => {
    this.setState({ [state]: event.currentTarget });
  }

  handleDropdownClose = (state) => {
    this.setState({ [state]: null });
  }

  setAlgorithmOnMenu = (algorithm) => {
    const { setAlgorithm } = this.props;

    setAlgorithm(algorithm);
    this.setState({ featuresSelectionShow: algorithm === 'Customed' });
    this.handleDropdownClose('algorithmDropdownElement');
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
        {/* <Button
          aria-controls="xAxisFeature-menu"
          aria-haspopup="true"
          onClick={(e) => this.handleDropdownOpen(e, 'xAxisFeatureDropdownElement')}
          className={classes.button}>
          X-Axis: {xAxisFeature}
        </Button>
        <Menu
          id="xAxisFeature-menu"
          getContentAnchorEl={null}
          anchorEl={this.state.xAxisFeatureDropdownElement}
          keepMounted
          open={Boolean(this.state.xAxisFeatureDropdownElement)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClose={() => this.handleDropdownClose('xAxisFeatureDropdownElement')}>
          {xAxisOptions}
        </Menu> */}
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
