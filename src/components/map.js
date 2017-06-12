import React, { Component } from 'react';

const chartHeight = 600;
const chartWidth = 800;

class Map extends Component {

  render() {
     return (
      <div className="map" style={{height:chartHeight, position: 'relative', width: chartWidth}}>
        <svg style={{background: 'lightgray', height: chartHeight, width: chartWidth}}></svg>
      </div>
    );
  }
}

export default Map;
