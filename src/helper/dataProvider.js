import axios from 'axios';
import qs from 'qs';

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
    const cors_url = 'https://cors-anywhere.herokuapp.com/';
    const api_url = 'https://accounts.spotify.com/api/token';
    const request_url = cors_url + api_url;
    const clientId = '436d61cb446a48b0a9867aed113380c4';
    const clientSecret = '647ae3f395474d74bde32870ccf955e7';
    const basicAuth = 'Basic ' + btoa(clientId + ':' + clientSecret);
    const bodyParameters = {
      grant_type: 'client_credentials',
      refresh_token: 'BQDLgWFfNca-UOxmt8oBYyorMVhRI0Na2sBhk0ieCApurG4_V_x52gwohg3EXiwdMjtsTnoENPsrKXqa526Cr6VzYX5B8eWbJaemyhgPNksXOix8vo4xMdyIapi8jXwwams1x8mqaT6AGEZlAAJloW4wIs_IgxQhear7He-Qx7tfjqb62Wk6TSMv'
    };

    axios.post(request_url, qs.stringify(bodyParameters), {
      headers: {
        'Authorization': basicAuth,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {
      console.log(response);
    }).catch(function(error) {
      console.log(error);
    });
  }
  // More APIs, I mean our APIs that can be directly called in Viz page
};

export default dataProvider;