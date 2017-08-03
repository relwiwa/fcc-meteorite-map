import axios from 'axios';
import es6Promise from 'es6-promise';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { feature } from 'topojson-client';

import Calculations from './calculations';
import MapProjectionWithResizeHandling from './map-projection-with-resize-handling';
import MeteoriteMapFilter from './meteorite-map-filter';

import SPEX from '../data/meteorite-map.spex';

/*  Origin of data:
    - SHP-file from http://www.naturalearthdata.com
    - Converted using ogr2ogr to geoJson and then to topoJson
    - Antarctica was extracted
    - Commands:
      - ogr2ogr -f GeoJSON -where "ISO_A2 NOT IN ('AQ')" units.json ne_50m_admin_0_countries_lakes.shp
      - topojson --simplify-proportion .08 --id-property SU_A3 -p name=NAME -o countries.json units.json */
//import topoJsonData from '../data/countries.topo.json';

es6Promise.polyfill();
const axiosConfig = axios.create({
  timeout: 5000
});

class MeteoriteMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animationCounter: 0,
      countriesData: [],
      currentCenturyFilter: null,
      currentStrikeData: [],
      strikesByCentury: [],
    }
  }
  
  componentWillMount() {
    this.getTopoJsonData();
    this.getStrikeData();
  }

  getTopoJsonData() {
    axios.get('https://relwiwa.github.io/datasets/fcc-meteorite-map/countries.topo.json')
      .then((data) => {
        const topoJsonData = data.data;
        this.setState({
          countriesData: feature(topoJsonData, topoJsonData.objects.units).features,
        });
      },
      (error) => {
        console.log('error countries data', error);
      });
  }

  getStrikeData() {
    axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json')
      .then(
        (data) => {
        const preparedStrikeData = this.prepareStrikeData(data.data);
        let strikeData = preparedStrikeData.strikeData;
        strikeData = this.sortStrikeDataByMass(strikeData);
        this.setState({
          animationCounter: 0,
          currentStrikeData: strikeData,
          currentCenturyFilter: SPEX.strikes.centuriesFilter[0],
          strikesByCentury: preparedStrikeData.strikesByCentry,
        });
      },
      (error) => {
        console.log('error strike data', error);
      });
  }

  handleStrikesAnimated() {
    const { animationCounter } = this.state;
    const { centuriesFilter } = SPEX.strikes;

    if (animationCounter >= centuriesFilter.length - 1) {
      this.setState({
        animationCounter: null,
        currentCenturyFilter: null,
      });
    }
    else {
      this.setState({
        animationCounter: animationCounter + 1,
        currentCenturyFilter: centuriesFilter[animationCounter + 1],
      });
    }
  }

  handleFilterByCentury(filterBy) {
    const { currentYearFilter } = this.state;

    this.setState({
      currentCenturyFilter: filterBy,
    });
  }

  /** @name prepareStrikeData
   *  @description sets up two objects:
   *  - one for general display, with just the properties needed
   *  - another for animation of strikes, containing the ids of the strike objects, sorted by century
   *  @param {*} data - strikeData that was loaded remotely */
  prepareStrikeData(data) {
    let strikeData = [];
    const strikeAmount = 953;
    let strikesByCentury = {};
    SPEX.strikes.centuriesFilter.map(item => {
      strikesByCentury[item] =  [];
    });

    data.features.map((feature, index) => {
      if (feature.geometry && feature.properties.mass !== null && feature.properties.year !== null) {
        const year = feature.properties.year.substr(0, 4);
        const century = Number(year.substr(0, 2) + '00'); 
        let strikeDatum = {
          century: century,
          coordinates: feature.geometry.coordinates,
          id: feature.properties.id,
          fill: `rgba(38,50,56,${1 / strikeAmount * index})`,
          mass: Number(feature.properties.mass),
          name: feature.properties.name,
          radius: feature.properties.mass * 0.0001,
          year: year,
        };
        // Get rid of outlier values
        if (strikeDatum.year > 1000 && strikeDatum.mass < 1000000) {
          strikeData.push(strikeDatum);
          strikesByCentury[century].push({
            id: strikeDatum.id,
            year: year
          });
        }
      }
    });
    return {
      strikeData: strikeData,
      strikesByCentry: strikesByCentury   
    }
  }

  // Sort strike Data for proper display in SVG (order is important)
  sortStrikeDataByMass(data) {
    return data.sort((a, b) => {
      return b.mass - a.mass
    });
  }
  
  render() {
    const { animationCounter, countriesData, currentCenturyFilter, currentStrikeData, strikesByCentury } = this.state;
    const { centuriesFilter } = SPEX.strikes;

    return (
      <div className="meteorite-map grid-container grid-container-padded">
        <div className="grid-x">
          <div className="cell text-center">
            <h1>Map of Meteorite Strikes Across the World</h1>
            <p>This is an interactive map displaying meteorite strikes across the world between 1400 up until now</p>
              {/*<Calculations
                strikeData={currentStrikeData}
              />*/}
              <MeteoriteMapFilter
                currentFilter={currentCenturyFilter}
                filterFunctionalityActive={animationCounter === null ? true : false}
                filterCategories={centuriesFilter}
                onUpdateFilter={(filterData) => this.handleFilterByCentury(filterData)}
              />
              <MapProjectionWithResizeHandling
                strikesToAnimate={animationCounter !== null ? strikesByCentury[centuriesFilter[animationCounter]] : null}
                countriesData={countriesData}
                currentCenturyFilter={currentCenturyFilter}
                onStrikesAnimated={animationCounter !== null ? () => this.handleStrikesAnimated() : null}
                strikeData={currentStrikeData}
              />
          </div>
        </div>
      </div>
    );
  }
};

export default MeteoriteMap;
