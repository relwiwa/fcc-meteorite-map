import React from 'react';

import MapProjection from './map-projection';
import withResizeHandling from '../hoc/with-resize-handling';

import SPEX from '../data/meteorite-map.spex';

const MapProjectionWithResizeHandling = withResizeHandling(
  MapProjection,
  SPEX.map.ratioFactor
);

export default MapProjectionWithResizeHandling;
