/*  Creating a d3 map within react, adapted from:
    - https://bost.ocks.org/mike/map
    - https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98
    - https://medium.com/@caspg/responsive-chart-with-react-and-d3v4-afd717e57583 */

import React, { Component } from 'react';
import { geoMercator as d3GeoMercator, geoPath as d3GeoPath } from 'd3-geo';
import { feature } from 'topojson-client';

import SPEX from '../data/meteorite-map.spex';

/*  Origin of data:
    - SHP-file from http://www.naturalearthdata.com
    - Converted using ogr2ogr to geoJson and then to topoJson
    - Antarctica was extracted
    - Commands:
      - ogr2ogr -f GeoJSON -where "ISO_A2 NOT IN ('AQ')" units.json ne_50m_admin_0_countries_lakes.shp
      - topojson --simplify-proportion .08 --id-property SU_A3 -p name=NAME -o countries.json units.json */
import topoJsonData from '../data/countries.topo.json';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countriesData: [],
      currentStrike: null,
    }
  }

  componentDidMount() {
    this.setState({
      countriesData: feature(topoJsonData, topoJsonData.objects.units).features,
    });
  }

  mapProjection() {
    const { chartHeight, chartWidth } = this.props;
    const { mercator } = SPEX;

    return (
      d3GeoMercator()
        // trial and error approach to find proper values to scale chart nicely
        .fitSize([chartWidth, chartHeight - (40 * (chartWidth * 0.0015))], mercator.topoJsonDimensions)
    );
  }

  render() {
    const { chartHeight, chartWidth, strikeData } = this.props;
    const { countriesData, currentStrike } = this.state;

    const strikeAmount = strikeData.length;

     return (
      <div
        className="map" style={{height: '100%', position: 'relative', width: '100%'}}>
        <svg style={{background: 'lightgray', height: chartHeight, width: '100%'}}>
          <g>
            {countriesData.map((countryDatum, index) => (
              <path
                key={index}
                d={d3GeoPath(this.mapProjection())(countryDatum)}
                fill="lightblue"
                stroke="gray"
                strokeWidth="0.5"
              />
            ))}
          </g>
         {<g>
            {strikeData.map((strikeDatum, index) => {
              const coords = this.mapProjection()(strikeDatum.coordinates);
              let radius = strikeDatum.mass * 0.00005;
              if (radius > 100) {
                radius = radius / 10;
              }
              return (
                <circle
                  cx={coords[0]}
                  cy={coords[1]}
                  fill={`rgba(38,50,56,${1 / strikeAmount * index})`}
                  key={strikeDatum.id}
                  r={radius}
                />
              )
            })}
          </g>}
        </svg>
      </div>
    );
  }
}

export default Map;
