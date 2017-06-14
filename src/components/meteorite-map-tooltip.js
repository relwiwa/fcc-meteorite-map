import React from 'react';

import '../styles/meteorite-map-tooltip.scss';

const MeteoriteMapTooltip = (props) => {
  const { currentStrike } = props;

  return (
    <div className="meteorite-map-tooltip text-center">
      <b>{currentStrike.name}</b> had a mass of <b>{(currentStrike.mass / 1000)} kg</b> in <b>{currentStrike.year}</b>
    </div>    
  );
}

export default MeteoriteMapTooltip;
