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
  // More APIs, I mean our APIs that can be directly called in Viz page
};

export default dataProvider;