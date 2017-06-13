import React from 'react';

import Map from './map';
import withResizeHandling from '../hoc/with-resize-handling';

import SPEX from '../data/meteorite-map.spex';

const mapWithResizeHandling = withResizeHandling(
  Map,
  SPEX.map.ratioFactor
);

export default mapWithResizeHandling;
