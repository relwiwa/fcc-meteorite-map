import React from 'react';

import { feature } from 'topojson-client';
import topoJsonData from '../data/countries.topo.json';

const Calculations = (props) => {
  const calculateMapExtent = () => {
    let data = feature(topoJsonData, topoJsonData.objects.units).features;
    let maxX = 0;
    let minX = 10000;
    let maxY = 0;
    let minY = 10000;

    data.map((item) => {
      let innerItem = item.geometry.coordinates[0];
      for (let i = 0; i < innerItem.length; i++) {
        if (innerItem[i][0] < minX) {
          minX = innerItem[i][0];
        }
        if (innerItem[i][0] > maxX) {
          maxX = innerItem[i][0];
        }
        if (innerItem[i][1] < minY) {
          minY = innerItem[i][1];
        }
        if (innerItem[i][1] > maxY) {
          maxY = innerItem[i][1];
        }
      }
    });

    console.log({
      minX: minX, // -92.22322232223222
      maxX: maxX, // 119.69396939693968
      minY: minY, // -34.931092923745524
      maxY: maxY // 66.43319187387497
    });
  };

  calculateMapExtent();

  return (
    <div className="calculation"></div>
  );
}

export default Calculations;
