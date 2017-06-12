/*  Creating a d3 map within react, adapted from:
    - https://bost.ocks.org/mike/map
    - https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98 */

import React, { Component } from 'react';
import { geoMercator as d3GeoMercator, geoPath as d3GeoPath } from 'd3-geo';
import { feature } from 'topojson-client';

/*  Origin of data:
    - SHP-file from http://www.naturalearthdata.com
    - Converted using ogr2ogr to geoJson and then to topoJson */
import topoJsonData from '../data/countries.topo.json';

const chartHeight = 600;
const chartWidth = 800;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countriesData: [],
    }
  }

  componentDidMount() {
    this.setState({
      countriesData: feature(topoJsonData, topoJsonData.objects.units).features,
    });
  }

  setupMap() {
    return (
      d3GeoMercator()
        .scale(100)
        .translate([chartWidth / 2, chartHeight /2])
    );
  }

  render() {
    const { strikeData } = this.props;
    const { countriesData } = this.state;

     return (
      <div className="map" style={{height:chartHeight, position: 'relative', width: chartWidth}}>
        <svg style={{background: 'lightgray', height: chartHeight, width: chartWidth}}>
          <g>
            {countriesData.map((countryDatum, index) => (
              <path
                // index as key is ok, as topojson data is served from static file
                key={index}
                d={d3GeoPath(this.setupMap())(countryDatum)}
                fill="lightblue"
                stroke="gray"
                strokeWidth="0.5"
              />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}

export default Map;
