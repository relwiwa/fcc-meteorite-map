const SPEX = {
  map: {
    ratioFactor: 0.6
  },
  mercator: {
    topoJsonDimensions: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [ 119.69396939693968, 66.43319187387497 ],
            [ -92.22322232223222, 66.43319187387497 ],
            [ 119.69396939693968, -34.931092923745524 ],
            [ -92.22322232223222, -34.931092923745524 ]
          ]]
        }
      }]
    }
  },
  strikes: {
    centuriesFilter: [1400, 1500, 1600, 1700, 1800, 1900, 2000]
  }
};

export default SPEX;
