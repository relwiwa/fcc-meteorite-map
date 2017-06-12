import React from 'react';
import { render } from 'react-dom';

import './global-styles.scss';
import MeteoriteMap from './components/meteorite-map';

render(
  <MeteoriteMap />,
  document.getElementById('root')
);
