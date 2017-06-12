import axios from 'axios';
import es6Promise from 'es6-promise';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Map from './map';

es6Promise.polyfill();
const axiosConfig = axios.create({
  timeout: 1000
});

class MeteoriteMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      strikeData: [],
    }
  }

  componentWillMount() {
    this.getStrikeData();
  }

  getStrikeData() {
    axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json')
    .then((data) => {
      const strikeData = this.prepareStrikeData(data.data);
      this.setState({
        strikeData: strikeData,
      })
    });
  }

  prepareStrikeData(data) {
    let strikeData = [];
    data.features.map((feature) => {
      strikeData.push(feature);
    });
    return strikeData;   
  }
  
  render() {
    const { strikeData } = this.state;

    return (
      <div className="meteorite-map row">
        <div className="column small-12">
          <h1 className="text-center">Map of Meteorite Landings Across the World</h1>
            <Map
              strikeData={strikeData}
            />
        </div>
      </div>
    );
  }
};

export default MeteoriteMap;
