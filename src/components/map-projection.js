/*  Creating a responsive d3 map within react, adapted from:
    - https://bost.ocks.org/mike/map
    - https://medium.com/@zimrick/how-to-create-pure-react-svg-maps-with-topojson-and-d3-geo-e4a6b6848a98
    - https://medium.com/@caspg/responsive-chart-with-react-and-d3v4-afd717e57583
    - https://coderwall.com/p/psogia/simplest-way-to-add-zoom-pan-on-d3-js */

import React, { Component } from 'react';
import { geoMercator as d3GeoMercator, geoPath as d3GeoPath } from 'd3-geo';
import { zoom as d3Zoom,  zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import { event as d3Event, select as d3Select, selectAll as d3SelectAll } from 'd3-selection';

import MeteoriteMapCountries from './meteorite-map-countries';
import MeteoriteMapStrikes from './meteorite-map-strikes';
import MeteoriteMapTooltip from './meteorite-map-tooltip';

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

    this.zoom = d3Zoom()
      .scaleExtent([1, 8])
      .on('zoom', () => {
        svg.attr('transform', d3Event.transform);
        if (!this.state.zoomed) {
          this.setState({ zoomed: true });
        }
      });

    svg.call(this.zoom);

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
      .call(this.zoom.transform, d3ZoomIdentity);
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
      return {
        projection: this.mapProjection(chartHeight, chartWidth)(strikeDatum.coordinates),
        radius: strikeDatum.radius * (chartWidth/2 * 0.003)
      }
    });

    this.setState({
      strikesProjection: strikesProjection,
    });
  }


  render() {
    const { chartHeight, chartWidth, currentCenturyFilter, strikeData } = this.props;
    const { countriesProjection, currentStrike, strikesProjection, zoomed } = this.state;

    return (
      <div
        className="map-projection"
        style={{height: chartHeight, position: 'relative', width: chartWidth}}
      >
        <svg style={{background: 'lightgray', zIndex: 500, height: chartHeight, width: '100%', position: 'absolute', top: 0, left: 0}}>
          <g ref={(el) => this.svgContentContainer = el}>
            <MeteoriteMapCountries
              countriesProjection={countriesProjection}
            />
            <MeteoriteMapStrikes
              currentCenturyFilter={currentCenturyFilter}
              onUpdateCurrentStrike={(strikeDatum) => this.setState({ currentStrike: strikeDatum })}
              strikeData={strikeData}
              strikesProjection={strikesProjection}
            />
          </g>
        </svg>
        <div style={{position: 'absolute', bottom:0, left: 0, zIndex:501}}>
          <a
            className={'button' + (this.state.zoomed ? '' : ' disabled')}
            onClick={zoomed ? () => this.resetZoom() : null}
          >Reset Zoom</a>
        </div>        
        {currentStrike !== null && <MeteoriteMapTooltip
          currentStrike={currentStrike}
        />}
        {/*<div>
          {currentStrike !== null ? currentStrike.mass : null}
        </div>*/}
      </div>
    );
  }
}

export default MapProjection;
