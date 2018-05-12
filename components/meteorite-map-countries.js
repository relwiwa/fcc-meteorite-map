import React, { PureComponent } from 'react';

import '../styles/meteorite-map-countries.scss';

class MeteoriteMapCountries extends PureComponent {

  /* This is not necessary as PureComponent is used */
  /*shouldComponentUpdate(nextProps) {
    if (this.props.countriesProjection === nextProps.countriesProjection) {
      return false;
    }
    else {
      return true;
    }
  }*/

  render() {
    const { countriesProjection } = this.props;

    return(
      <g className="meteorite-map-countries">
        {countriesProjection.map((projection, index) => {
          return (
            <path
              d={projection}
              key={index}
            />
          )
        })}
      </g>
    );
  }
}

export default MeteoriteMapCountries;

