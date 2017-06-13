import React from 'react';

import { feature } from 'topojson-client';
import topoJsonData from '../data/countries.topo.json';

const Calculations = (props) => {
  const { strikeData } = props;
  console.log(strikeData);

  if (strikeData.length > 0) {

    const calculateTimeDistribution = () => {
      let years = [];
      strikeData.map((strikeDatum) => {
        const year = new Date(strikeDatum.year).getFullYear();
        if (years[year] === undefined) {
          years[year] = 1;
        }
        else {
          years[year]++;
        }
      })
      console.log('years:', years);

      let centuries = [];
      years.map((amount, index) => {
        if (!Number.isNaN(amount)) {
          const century = index - index % 100;
          if (centuries[century] === undefined) {
            centuries[century] = amount;
          }
          else {
            centuries[century] += amount;
          }
        }
      })
      console.log('centuries:', centuries);

      let sum = 0;
      centuries.map(amount => {
        sum += amount;
      });
      console.log('sum of meteorite strikes in centuries array:', sum);
    }


    calculateTimeDistribution();  


    const calculateMassDistribution = () => {
      let masses = []
      strikeData.map(strikeDatum => {
        const mass = strikeDatum.mass;
        if (masses[mass] === undefined) {
          masses[mass] = 1;
        }
        else {
          masses[mass]++;
        }
      });
      console.log('masses:', masses);

      let distributionMasses = {
        100: 0,
        500: 0,
        1000: 0,
        5000: 0,
        10000: 0,
        50000: 0,
        100000: 0,
        more: 0
      };
      strikeData.map(strikeDatum => {
        const { mass } = strikeDatum;
        if (mass <= 100) {
          distributionMasses[100]++;
        }
        else if (mass <= 500) {
          distributionMasses[500]++;
        }
        else if (mass <= 1000) {
          distributionMasses[1000]++;
        }
        else if (mass <= 5000) {
          distributionMasses[5000]++;
        }
        else if (mass <= 10000) {
          distributionMasses[10000]++;
        }
        else if (mass <= 50000) {
          distributionMasses[50000]++;
        }
        else if (mass <= 100000) {
          distributionMasses[100000]++;
        }
        else {
          console.log(mass);
          distributionMasses['more']++;
        }
      })
      console.log(distributionMasses);
    }

    calculateMassDistribution();  


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

      console.log('minimum and maximum coordinates of json data', {
        minX: minX, // -92.22322232223222
        maxX: maxX, // 119.69396939693968
        minY: minY, // -34.931092923745524
        maxY: maxY // 66.43319187387497
      });
    };

    calculateMapExtent();

  }

  return (
    <div className="calculation"></div>
  );
}

export default Calculations;
