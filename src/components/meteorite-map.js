import axios from 'axios';
import es6Promise from 'es6-promise';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { feature } from 'topojson-client';

//import Calculations from './calculations';
import MapWithResizeHandling from './map-with-resize-handling';

/*  Origin of data:
    - SHP-file from http://www.naturalearthdata.com
    - Converted using ogr2ogr to geoJson and then to topoJson
    - Antarctica was extracted
    - Commands:
      - ogr2ogr -f GeoJSON -where "ISO_A2 NOT IN ('AQ')" units.json ne_50m_admin_0_countries_lakes.shp
      - topojson --simplify-proportion .08 --id-property SU_A3 -p name=NAME -o countries.json units.json */
import topoJsonData from '../data/countries.topo.json';

es6Promise.polyfill();
const axiosConfig = axios.create({
  timeout: 1000
});

class MeteoriteMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countriesData: feature(topoJsonData, topoJsonData.objects.units).features,
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
    const strikeAmount = 988;

    data.features.map((feature, index) => {
      if (feature.geometry) {
        let strikeDatum = {
          coordinates: feature.geometry.coordinates,
          id: feature.properties.id,
          fill: `rgba(38,50,56,${1 / strikeAmount * index})`,
          mass: feature.properties.mass,
          name: feature.properties.name,
          radius: feature.properties.mass * 0.00005,
          year: feature.properties.year,
        };
        if (strikeDatum.radius > 100) {
          strikeDatum.radius = strikeDatum.radius / 10;
        }
        strikeData.push(strikeDatum);
      }
    });
    return strikeData;   
  }
  
  render() {
    const { countriesData, strikeData } = this.state;

    return (
      <div className="meteorite-map row">
        <div className="column small-12">
          <h1 className="text-center">Map of Meteorite Landings Across the World</h1>
            {/*<Calculations />*/}
            <MapWithResizeHandling
              countriesData={countriesData}
              strikeData={strikeData}
            />
        </div>
      </div>
    );
  }
};

export default MeteoriteMap;
