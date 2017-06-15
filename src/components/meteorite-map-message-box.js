import React from 'react';

import '../styles/meteorite-map-message-box.scss';

const MeteoriteMapMessageBox = (props) => {
  const { currentStrike } = props;

  return (
    <div className="meteorite-map-message-box text-center">
      {props.children}
    </div>    
  );
}

export default MeteoriteMapMessageBox;
