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
  // More APIs, I mean our APIs that can be directly called in Viz page
};

export default dataProvider;