/*  Creating a responsive d3 map within react, adapted from:
    - https://bost.ocks.org/mike/map
    - https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98
    - https://medium.com/@caspg/responsive-chart-with-react-and-d3v4-afd717e57583
    - https://coderwall.com/p/psogia/simplest-way-to-add-zoom-pan-on-d3-js */

import React, { Component } from 'react';
import { geoMercator as d3GeoMercator, geoPath as d3GeoPath } from 'd3-geo';
import { zoom as d3Zoom,  zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import { event as d3Event, select as d3Select, selectAll as d3SelectAll } from 'd3-selection';
import SPEX from '../data/meteorite-map.spex';

import '../styles/map-projection.scss';

class MapProjection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countriesProjection: [],
      currentStrike: null,
      strikesProjection: [],
      zoomed: false,
    }
  }

  componentDidMount() {
    const { chartHeight, chartWidth } = this.props;

    this.updateCountriesProjection(chartHeight, chartWidth);
    this.addZoom();
  }

  componentWillReceiveProps(nextProps) {
    const { chartHeight, chartWidth, strikeData } = nextProps;

    this.updateCountriesProjection(chartHeight, chartWidth);
    this.updateStrikeProjection(chartHeight, chartWidth, strikeData);
  }

  addZoom() {
    const svg = d3Select(this.svgContentContainer)

    const zoom = d3Zoom()
      .scaleExtent([1, 8])
      .on('zoom', () => {
        svg.attr('transform', d3Event.transform);
        if (!this.state.zoomed) {
          this.setState({ zoomed: true });
        }
      });

    svg.call(zoom);

  }

  mapProjection(chartHeight, chartWidth) {
    const { mercator } = SPEX;

    return (
      d3GeoMercator()
        // trial and error approach to find proper values to scale chart nicely
        .fitSize([chartWidth, chartHeight - (40 * (chartWidth * 0.0015))], mercator.topoJsonDimensions)
    );
  }

  resetZoom() {
    const svg = d3Select(this.svgContentContainer)
      .attr('transform', 'translate(0,0) scale(1)');
    this.setState({
      zoomed: false,
    });
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
    const { countriesProjection, currentStrike, strikesProjection, zoomed } = this.state;

    return (
      <div
        className="map-projection"
        style={{height: '100%', position: 'relative', width: '100%'}}
      >
        <svg style={{background: 'lightgray', height: chartHeight, width: '100%', position: 'absolute', top: 0, left: 0}}
        >
          <g ref={(el) => this.svgContentContainer = el}>
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
            <g>
              {strikeData.map((strikeDatum, index) => {
                return (
                  <circle
                    key={strikeDatum.id}
                    cx={strikesProjection[index][0]}
                    cy={strikesProjection[index][1]}
                    fill={strikeDatum.fill}
                    onMouseEnter={() => this.setState({ currentStrike: strikeDatum })}
                    onMouseLeave={() => this.setState({ currentStrike: null })}
                    r={strikeDatum.radius * (chartWidth/2 * 0.003)}
                  />
                )
              })}
            </g>
          </g>
        </svg>
        <div style={{position: 'absolute', top:0, left: 0, width: '100%', height:'100%'}}>
          <a
            className={'button' + (this.state.zoomed ? '' : ' disabled')}
            onClick={zoomed ? () => this.resetZoom() : null}
          >Reset Zoom</a>
        </div>
        {/*<div>
          {currentStrike !== null ? currentStrike.mass : null}
        </div>*/}
      </div>
    );
  }
}

export default MapProjection;
