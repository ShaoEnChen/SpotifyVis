import React from 'react';
import { withStyles } from '@material-ui/styles';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

class PlaylistInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playlistId: ''
    };
  }

  handleOnChange = (e) => {
    this.setState({
      playlistId: e.target.value
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submit();
    }
  }

  submit = () => {
    const playlistId = this.state.playlistId;
    if (playlistId.includes('/')) {
      console.log('Please use a playlist id instead of url');
      return;
    }

    this.props.history.push(`/vis?pl=${playlistId}`);
  }

  render() {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <InputBase
          onChange={this.handleOnChange}
          onKeyPress={this.handleKeyPress}
          className={classes.bootstrapInput}>
        </InputBase>
        <Button
          onClick={this.submit}
          variant="contained"
          color="primary"
          className={classes.buttonLink}>
          Go!
        </Button>
      </FormControl>
    );
  }
}

const styles = (theme) => {
  return ({
    formControl: {
      display: 'inline-flex',
      flexFlow: 'row',
      width: '40%'
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

export default withStyles(styles)(PlaylistInput);
