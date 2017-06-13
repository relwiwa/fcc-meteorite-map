/*  Creating a d3 map within react, adapted from:
    - https://bost.ocks.org/mike/map
    - https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98
    - https://medium.com/@caspg/responsive-chart-with-react-and-d3v4-afd717e57583 */

import React, { Component } from 'react';
import { geoMercator as d3GeoMercator, geoPath as d3GeoPath } from 'd3-geo';

import SPEX from '../data/meteorite-map.spex';

import '../styles/map.scss';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countriesProjection: [],
      currentStrike: null,
      strikesProjection: [],
    }
  }

  componentDidMount() {
    const { chartHeight, chartWidth } = this.props;

    this.updateCountriesProjection(chartHeight, chartWidth);
  }

  componentWillReceiveProps(nextProps) {
    const { chartHeight, chartWidth, strikeData } = nextProps;

    this.updateCountriesProjection(chartHeight, chartWidth);
    this.updateStrikeProjection(chartHeight, chartWidth, strikeData);
  }

  mapProjection(chartHeight, chartWidth) {
    const { mercator } = SPEX;

    return (
      d3GeoMercator()
        // trial and error approach to find proper values to scale chart nicely
        .fitSize([chartWidth, chartHeight - (40 * (chartWidth * 0.0015))], mercator.topoJsonDimensions)
    );
  }

  updateCountriesProjection(chartHeight, chartWidth) {
    const { countriesData } = this.props;

    let countriesProjection = countriesData.map((countryDatum) => {
      return d3GeoPath(this.mapProjection(chartHeight, chartWidth))(countryDatum);
    });

    this.setState({
      countriesProjection: countriesProjection,
    });
  }

  updateStrikeProjection(chartHeight, chartWidth, strikeData) {
    let strikesProjection = strikeData.map((strikeDatum) => {
      return this.mapProjection(chartHeight, chartWidth)(strikeDatum.coordinates);
    });

    this.setState({
      strikesProjection: strikesProjection,
    });
  }


  render() {
    const { chartHeight, chartWidth, strikeData } = this.props;
    const { countriesProjection, currentStrike, strikesProjection } = this.state;

    const strikeAmount = strikeData.length;

     return (
      <div
        className="map" style={{height: '100%', position: 'relative', width: '100%'}}>
        <svg style={{background: 'lightgray', height: chartHeight, width: '100%'}}>
          <g>
            {countriesProjection.map((projection, index) => {
              return (
                <path
                  key={index}
                  d={projection}
                  fill="lightblue"
                  stroke="gray"
                  strokeWidth="0.5"
                />
              )
            })}
          </g>
         {<g>
            {strikeData.map((strikeDatum, index) => {
              return (
                <circle
                  key={strikeDatum.id}
                  cx={strikesProjection[index][0]}
                  cy={strikesProjection[index][1]}
                  fill={strikeDatum.fill}
                  onMouseEnter={() => this.setState({ currentStrike: strikeDatum.id })}
                  onMouseLeave={() => this.setState({ currentStrike: null })}
                  r={strikeDatum.radius}
                />
              )
            })}
          </g>}
        </svg>
        <div>
          {currentStrike !== null ? currentStrike : null}
        </div>
      </div>
    );
  }
}

export default Map;
