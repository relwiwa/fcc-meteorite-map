import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Map from './map';

import strikeData from '../data/meteorite-strike-data.json';

class MeteoriteMap extends Component {

  render() {

    return (
      <div className="meteorite-map row">
        <div className="column small-12">
          <h1 className="text-center">Map of Meteorite Landings Across the World</h1>
            <Map />
        </div>
      </div>
    );
  }
};

export default MeteoriteMap;
