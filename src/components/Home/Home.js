import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import Navbar from '../Navbar/Navbar';
import Jumbotron from './Jumbotron';
import theme from '../../helper/theme';

class Home extends React.Component {
  render() {
    const { location, history } = this.props;
    const path = location.pathname;
    return (
      <ThemeProvider theme={theme}>
        <Navbar location={path} history={history} />
        <Jumbotron history={history} />
        <div id="tutorial">
        <center>
          <h1>Welcome to SpotiViz!</h1>
          <h3>
            Have you ever clicked on a large playlist trying to find new music? And then ended up just clicking random songs? <br />
            It's hard to find the songs you like in a playlist doing that. We're here to help!
          </h3>
          <h4>
            SpotiViz is a Spotify visualization platform for music exploration and learning.<br />
          </h4>
          <img src="splashdemo.png" alt="splashdemo" width="60%" height= "auto"></img>
          </center>
        </div>
        <center>
        <section>
            <br />
						<h2>How To Use SpotiViz:</h2>
						<div class="row">
							<article class="col-6 col-12-xsmall work-item">
								<a href="tutorial1alt.png" class="image fit thumb"><img src="tutorial1alt.png" alt="" width="75%" height= "auto"/></a>
								<h3>1. Grab a playlist URL from Spotify</h3>
								<p>Navigate to Spotify.com, find your playlist, and grab the URL!</p>
							</article>
							<article class="col-6 col-12-xsmall work-item">
								<a href="tutorial2alt.png" class="image fit thumb"><img src="tutorial2alt.png" alt="" width="75%" height= "auto"/></a>
								<h3>2. Grab the playlist ID from the URL</h3>
								<p>Simply copy everything after the last '/'</p>
							</article>
							<article class="col-6 col-12-xsmall work-item">
								<a href="tutorial3.png" class="image fit thumb"><img src="tutorial3.png" alt="" width="75%" height= "auto"/></a>
								<h3>3. Paste it into our playlist ID holder</h3>
								<p>And then hit GO!</p>
							</article>
							<article class="col-6 col-12-xsmall work-item">
								<a href="tutorial4.png" class="image fit thumb"><img src="tutorial4.png" alt="" width="75%" height= "auto"/></a>
								<h3>4. Enjoy our visualization of your playlist's tracks</h3>
								<p>We use algorithms behind the scenes to display which songs are similar to each other!</p>
							</article>
							<article class="col-6 col-12-xsmall work-item">
								<a href="tutorial5.png" class="image fit thumb"><img src="tutorial5.png" alt="" width="75%" height= "auto"/></a>
								<h3>5. Zoom in to the bubbles to see which songs are which!</h3>
								<p>Since similar songs will be near each other, you can explore around songs you like</p>
							</article>
							<article class="col-6 col-12-xsmall work-item">
								<a href="tutorial6.png" class="image fit thumb"><img src="tutorial6.png" alt="" width="75%" height= "auto"/></a>
								<h3>6. Feel free to swap our algorithms out to get new visualizations</h3>
								<p>Or design your own! You can come up with one that works perfectly for you</p>
							</article>
						</div>
					</section>
          </center>
      </ThemeProvider>
    );
  }
}

export default Home;
