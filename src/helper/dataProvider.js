import axios from 'axios';

const dataProvider = {
  createRandomLocations: () => {
    let locations = {};
    let locationNum = 30;
  
    for (let i = 0; i < locationNum; i++) {
      locations[i] = {
        x: Math.random() * 100,
        y: Math.random() * 100
      };
    }
  
    return locations;
  },
  spotifyGet: () => {
    const accessToken = 'BQAgnXShwOKcLv93A7NhWknXlXoJtZapu4KuhIHO0wuqJkPPr0uQIop32nxUHggMKSVfRdFJdEkVvjJvBECizv98AG10f0cON21_eUyNt4748Ifs8PloqUMhNGtKCAGLcGy4NipTRNmSjQGMoLTcZy_chNMUHp4lH4bfHQOSY9c3KZJ4QF-3iEu4';
    axios.defaults.headers.common = {
      'Authorization': 'Bearer ' + accessToken
    };
  
    axios.get('https://api.spotify.com/v1/audio-features', {
      params: {
        // name: 'Flavio',
        ids:'4JpKVNYnVcJ8tuMKjAj50A,2NRANZE9UCmPAS5XVbXL40,24JygzOLM0EmRQeGtFcIcG'
      }
    }).then((response) => {
        console.log(response.data);
    });
  },
  spotifyPost: () => {
    var bodyParameters = {
      grant_type:'refresh_token',
      refresh_token:'AQC4ih6IXhSl8YQJNsyLexYhAXfZrlxpv9236scyWIL1k_qBm9l4et5SMIQfm_r5sKZbnMu4wDUvPYRnW0FoASGrN5jF2lrRsgu5C2_BxArmHD9o5J6PF1q35Do0VS9gMsacXQ'
    };

    var session_url = 'http://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token';
    var username = 'd83740bfd39e48cd9e1cee53425b375b';
    var password = 'eeb7bd011f2d41a0a0284a37a296cbf6';
    var basicAuth = 'Basic ' + btoa(username + ':' + password);

    axios.post(session_url, bodyParameters, {
      headers: { 'Authorization': + basicAuth },
      "Access-Control-Allow-Origin": "*"
    }).then(function(response) {
      console.log('Authenticated');
    }).catch(function(error) {
      console.log(error);
      console.log('Error on Authentication');
    });
  }
  // More APIs, I mean our APIs that can be directly called in Viz page
};

export default dataProvider;