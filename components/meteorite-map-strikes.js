import React, { Component } from 'react';

import '../styles/meteorite-map-strikes.scss';

import SPEX from '../data/meteorite-map.spex.js';

class MeteoriteMapStrikes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationCounter: 0,
    };
  }

  componentDidMount() {
    this.setupAnimationInterval();
  }

  componentDidUpdate() {
    if (this.props.strikesToAnimate) {
      if (this.displayInterval === null) {
        this.setupAnimationInterval();
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    const { currentCenturyFilter, strikeData, strikesProjection, strikesToAnimate } = this.props;

    if (strikeData.length === 0) {
      return true;
    }
    else if (strikesToAnimate !== null && strikesToAnimate !== nextProps.strikesToAnimate) {
      return true;
    }
    else if (currentCenturyFilter === nextProps.currentCenturyFilter && strikesProjection === nextProps.strikesProjection) {
      return false;
    }
    else {
      return true;
    }
  }

  componentWillUnmount() {
    clearInterval(this.displayInterval);
    clearTimeout(this.animationTimeout);
  }

  setupAnimationInterval() {
    const { strikesToAnimate } = this.props;
    const { intervalDuration, timeoutDuration } = SPEX.animation;

    this.displayInterval = setInterval(() => {
      if (this.state.animationCounter < strikesToAnimate.length - 1) {
        const el = document.getElementById(strikesToAnimate[this.state.animationCounter].id);
        el.setAttribute('class', el.className + ' visible');
        this.setState(
          {animationCounter: this.state.animationCounter + 1}
        );
      }
      else {
        clearInterval(this.displayInterval);
        this.displayInterval = null;
        this.animationTimeout = setTimeout(() => {
          strikesToAnimate.map(item => {
            const el = document.getElementById(item.id);
            el.setAttribute('class', '');
          })
          this.props.onStrikesAnimated();
        }, timeoutDuration);
        this.setState({
          animationCounter: 0
        });
      }
    }, intervalDuration / (strikesToAnimate.length - 1))
  }

  render() {
    const { currentCenturyFilter, onUpdateCurrentStrike, strikeData, strikesProjection } = this.props;

    return (
      <g className={'meteorite-map-strikes ' + ((currentCenturyFilter !== null) ? 'centuryFilter' + currentCenturyFilter : 'centuryFilterAll')}>
        {strikeData.map((strikeDatum, index) => {
          const projected = strikesProjection[index];
          return (
            <circle
              className={this.props.strikesToAnimate ? '' : 'century' + strikeDatum.century}
              cx={projected.projection[0]}
              cy={projected.projection[1]}
              fill={strikeDatum.fill}
              id={strikeDatum.id}
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
