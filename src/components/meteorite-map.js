import axios from 'axios';
import es6Promise from 'es6-promise';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//import Calculations from './calculations';
import MapWithResizeHandling from './map-with-resize-handling';

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
      if (feature.geometry) {
        let strikeDatum = {
          coordinates: feature.geometry.coordinates,
          id: feature.properties.id,
          mass: feature.properties.mass,
          name: feature.properties.name,
          year: feature.properties.year,
        };
        strikeData.push(strikeDatum);
      }
    });
    return strikeData;   
  }
  
  render() {
    const { strikeData } = this.state;

    return (
      <div className="meteorite-map row">
        <div className="column small-12">
          <h1 className="text-center">Map of Meteorite Landings Across the World</h1>
            {/*<Calculations />*/}
            <MapWithResizeHandling
              strikeData={strikeData}
            />
        </div>
      </div>
    );
  }
};

export default MeteoriteMap;
