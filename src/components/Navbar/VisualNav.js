import React from 'react';
import PlaylistInput from '../PlaylistInput/PlaylistInput';

class VisualNav extends React.Component {
  render() {
    const history = this.props.history;
    return (
      <PlaylistInput history={history} />
    );
  }
}

export default VisualNav;
