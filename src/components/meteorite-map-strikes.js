import React, { Component } from 'react';

import '../styles/meteorite-map-strikes.scss';

class MeteoriteMapStrikes extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.strikeData.length === 0) {
      return true;
    }
    else if (this.props.currentCenturyFilter === nextProps.currentCenturyFilter && this.props.strikesProjection === nextProps.strikesProjection) {
      return false;
    }
    else {
      return true;
    }
  }

  render() {
    const { currentCenturyFilter, onUpdateCurrentStrike, strikeData, strikesProjection } = this.props;

    return (
      <g className={'meteorite-map-strikes ' + ((currentCenturyFilter !== null) ? 'centuryFilter' + currentCenturyFilter : 'centuryFilterAll')}>
        {strikeData.map((strikeDatum, index) => {
          const projected = strikesProjection[index];
          return (
            <circle
              className={'century' + strikeDatum.century}
              cx={projected.projection[0]}
              cy={projected.projection[1]}
              fill={strikeDatum.fill}
              key={strikeDatum.id}
              onMouseEnter={() => onUpdateCurrentStrike(strikeDatum)}
              onMouseLeave={() => onUpdateCurrentStrike(null)}
              r={projected.radius}
            />
          )
        })}
      </g>      
    );
  }
}

export default MeteoriteMapStrikes;
