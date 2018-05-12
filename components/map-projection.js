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
import MeteoriteMapMessageBox from './meteorite-map-message-box';

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
    const { chartHeight, chartWidth} = this.props;

    this.updateCountriesProjection(chartHeight, chartWidth);
    this.addZoom();
  }

  componentWillReceiveProps(nextProps) {
    const { chartHeight, chartWidth, strikeData } = nextProps;

    this.updateCountriesProjection(chartHeight, chartWidth);
    this.updateStrikeProjection(chartHeight, chartWidth, strikeData);
  }

  componentWillUnmount() {
    d3Select(this.svgContentContainer)
      .on('zoom', null);
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
        .fitSize([chartWidth, chartHeight - (40 * (chartWidth * 0.0021))], mercator.topoJsonDimensions)
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
    const { chartHeight, chartWidth, currentCenturyFilter, onStrikesAnimated, strikeData, strikesToAnimate } = this.props;
    const { countriesProjection, currentStrike, strikesProjection, zoomed } = this.state;

    const countriesProjected = countriesProjection.length > 0 ? true : false;
    const strikesProjected = strikeData.length > 0 ? true : false;

    return (
      <div
        className="map-projection"
        style={{height: chartHeight, position: 'relative', width: chartWidth, minWidth: chartWidth, marginBottom: 20}}
      >
        <svg style={{height: chartHeight, width: '100%', minWidth: '100%'}}>
          <g ref={(el) => this.svgContentContainer = el}>
            <MeteoriteMapCountries
              countriesProjection={countriesProjection}
            />
            {countriesProjected && <MeteoriteMapStrikes
              currentCenturyFilter={currentCenturyFilter}
              onStrikesAnimated={onStrikesAnimated}
              onUpdateCurrentStrike={(strikeDatum) => this.setState({ currentStrike: strikeDatum })}
              strikeData={strikeData}
              strikesProjection={strikesProjection}
              strikesToAnimate={strikesToAnimate}
            />}
          </g>
        </svg>
        <div style={{position: 'absolute', bottom:0, left: 0, zIndex:501}}>
          <a
            className={'button' + (this.state.zoomed ? '' : ' disabled')}
            onClick={zoomed ? () => this.resetZoom() : null}
          >Reset Zoom</a>
        </div>
        {(countriesProjected && strikesToAnimate !== null && currentStrike === null) && <MeteoriteMapMessageBox>
          <b>{this.props.strikesToAnimate.length}</b> documented strike{this.props.strikesToAnimate.length > 1 ? 's' : ''} in the <b>{this.props.currentCenturyFilter / 100}th century</b>
        </MeteoriteMapMessageBox>}
        {(!countriesProjected || strikeData.length === 0) && <MeteoriteMapMessageBox>
          <span>Getting {!countriesProjected ? 'map' : ''} {!countriesProjected && !strikesProjected ? ' and' : ''} {!strikesProjected ? ' meteorite strike' : ''} data</span>
        </MeteoriteMapMessageBox>}
        {currentStrike !== null && <MeteoriteMapMessageBox>
          <b>{currentStrike.name}</b> had a mass of <b>{(currentStrike.mass / 1000)} kg</b> in <b>{currentStrike.year}</b>
        </MeteoriteMapMessageBox>}
        {/*<div>
          {currentStrike !== null ? currentStrike.mass : null}
        </div>*/}
      </div>
    );
  }
}

export default MapProjection;
