import React, { useState, useEffect, useContext } from 'react';
import { ColorMapContext } from './../Home/HomePage';
import Chart from 'react-apexcharts';
import axios from 'axios';
import GraphComponentWrapper from './GraphComponentWrapper';

function GerrymanderingGraph({ state }) {
  const colorMap = useContext(ColorMapContext);
  const [boxData, setBoxData] = useState([{}]);
  const [currentRace, setCurrentRace] = useState('White');
  const [currentSortedDistricts, setCurrentSortedDistricts] = useState([{}]);

  useEffect(() => {
    async function getBoxData() {
      const response = await axios.get(`http://localhost:8080/state/box`, {
        params: {
          state: state,
          race: currentRace,
        },
      });
      const values = response.data.map(box => {
        const y = [box.min, box.q1, box.med, box.q3, box.max];
        return { x: String(box.district), y };
      });
      setBoxData(values);
    }

    async function getCurrentSortedDistricts() {
      const response = await axios.get(`http://localhost:8080/state/dsorted`, {
        params: {
          state: state,
          race: currentRace,
        },
      });
      const values = response.data.map(item => {
        return {x: String(item.districtSorted), y: item.popPercent}
      });
      setCurrentSortedDistricts(values);
    }
    
    getBoxData();
    getCurrentSortedDistricts();
  }, [state, currentRace]);

  const options = {
    tooltip: {
      shared: false,
      intersect: true
    },
    xaxis: {
      title: {
        text: 'District'
      },
      labels: {
        rotate: -90,
      },
    },
    yaxis: {
      title: {
        text: `Percent of ${currentRace}`
      },
      labels: {
        formatter: function (val) {
          return `${val.toFixed(0)}%`;
        },
      },
    },
    markers: {
      size: 3,
    },
  };

  const series = [
    {
      type: 'boxPlot',
      name: 'District Plans',
      data: boxData
    },
    {
      type: 'scatter',
      name: 'Population %',
      color: colorMap[currentRace],
      data: currentSortedDistricts
    }
  ];

  return (
    <>
      <GraphComponentWrapper state={state} title={'Gerrymandering'} setCurrentRace={setCurrentRace}>
        <div className='card-container'>
          <h2>Box and Whisker</h2>
          <Chart options={options} series={series} type='boxPlot' height={500} />
        </div>
      </GraphComponentWrapper>
    </>
  );
}

export default GerrymanderingGraph;