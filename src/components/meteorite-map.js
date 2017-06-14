import axios from 'axios';
import es6Promise from 'es6-promise';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { feature } from 'topojson-client';

import Calculations from './calculations';
import MapProjectionWithResizeHandling from './map-projection-with-resize-handling';
import MapFilter from './map-filter';

import SPEX from '../data/meteorite-map.spex';

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
      currentYearFilter: null,
      currentStrikeData: [],
    }
  }
  
  componentWillMount() {
    this.getStrikeData();
  }

  filterStrikeDataByYear(filterBy) {
    const { strikeData } = this;

    const filteredData = strikeData.filter((item) => {
      if (item.year >= filterBy && item.year < filterBy + 100) {
        return true;
      }
      return false;
    });

    return filteredData;
  }

  getStrikeData() {
    axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json')
    .then((data) => {
      this.strikeData = this.prepareStrikeData(data.data);
      this.strikeData = this.sortStrikeData(this.strikeData);
      this.setState({
        currentStrikeData: this.strikeData,
      })
    });
  }

  handleFilterByYear(filterBy) {
    const { currentYearFilter } = this.state;

    if (filterBy !== currentYearFilter) {
      let filteredData;
      if (filterBy === null) {
        filteredData = this.strikeData;
      }
      else {
        filteredData = this.filterStrikeDataByYear(filterBy);
      }

      this.setState({
        currentStrikeData: filteredData,
        currentYearFilter: filterBy,
      });
    }
  }

  prepareStrikeData(data) {
    let strikeData = [];
    const strikeAmount = 953;

    data.features.map((feature, index) => {
      if (feature.geometry && feature.properties.mass !== null && feature.properties.year !== null) {
        let strikeDatum = {
          coordinates: feature.geometry.coordinates,
          id: feature.properties.id,
          fill: `rgba(38,50,56,${1 / strikeAmount * index})`,
          mass: Number(feature.properties.mass),
          name: feature.properties.name,
          radius: feature.properties.mass * 0.0001,
          year: feature.properties.year.substr(0, 4),
        };
        // Get rid of outlier values
        if (strikeDatum.year > 1000 && strikeDatum.mass < 1000000) {
          strikeData.push(strikeDatum);
        }
      }
    });
    return strikeData;   
  }

  // Sort strike Data for proper display in SVG (order is important)
  sortStrikeData(data) {
    return data.sort((a, b) => {
      return b.mass - a.mass
    });
  }
  
  render() {
    const { countriesData, currentYearFilter, currentStrikeData } = this.state;

    return (
      <div className="meteorite-map row">
        <div className="column small-12">
          <h1 className="text-center">Map of Meteorite Strikes Across the World</h1>
            {/*<Calculations
              strikeData={currentStrikeData}
            />*/}
            <MapFilter
              currentFilter={currentYearFilter}
              filterCategories={SPEX.strikes.yearsFilter}
              onUpdateFilter={(filterData) => this.handleFilterByYear(filterData)}
            />
            <MapProjectionWithResizeHandling
              countriesData={countriesData}
              strikeData={currentStrikeData}
            />
        </div>
      </div>
    );
  }
};

export default MeteoriteMap;
