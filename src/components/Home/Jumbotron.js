import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

class Jumbotron extends React.Component {

  constructor() {
    super();
    this.state = {
      playlistId: ''
    }
  }

  handleOnChange = (e) => {
    this.setState({
      playlistId: e.target.value
    })
  }

  renderInputField = () => {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <InputBase
          onChange={this.handleOnChange}
          className={classes.bootstrapInput}>
        </InputBase>
        <Button
          component={Link} to={`/vis?pl=${this.state.playlistId}`}
          variant="contained"
          color="primary"
          className={classes.buttonLink}>
          Go!
        </Button>
      </FormControl>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.toolbarIndent}></div>
        <div className={classes.section}>
          {this.renderInputField()}
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
    toolbarIndent: theme.mixins.toolbar,
    formControl: {
      display: 'inline-flex',
      flexFlow: 'row',
      width: '50%'
    },
    bootstrapInput: {
      width: '100%', // flex has default no-wrap so button will have space
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
      padding: '0.5em 1em',
      borderRadius: 4
    },
    buttonLink: {
      marginLeft: '1em'
    }
  });
};

export default withStyles(styles)(Jumbotron);