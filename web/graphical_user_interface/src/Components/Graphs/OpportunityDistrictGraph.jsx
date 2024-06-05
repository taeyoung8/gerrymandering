import React, { useState, useContext, useEffect } from 'react';
import { ColorMapContext } from '../Home/HomePage';
import axios from 'axios';
import Loading from '../Loading/Loading';
import Dropdown from 'react-bootstrap/Dropdown';
import Chart from 'react-apexcharts';

const OpportunityDistrictGraph = ({ state }) => {
  const { White, ...otherRacesColorMap } = useContext(ColorMapContext);
  const [dataBuckets, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [race, setRace] = useState('Black');
  const [plan, setPlan] = useState(5000);
  const [threshold, setThreshold] = useState(37);

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const response = await axios.get(`http://localhost:8080/state/opportunity`, {
        params: {
          state: state,
          race: race,
          ensemble: plan,
        },
      });
      const values = response.data.reduce(
        (acc, item) => {
          acc[37].push(item.lowCount);
          acc[44].push(item.mediumCount);
          acc[50].push(item.highCount);
          return acc;
        },
        { 37: [], 44: [], 50: [] }
      );
      const sortedValues = Object.entries(values).reduce((acc, [key, arr]) => {
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const buckets = Array.from({ length: max - min + 1 }, () => 0);
        arr.forEach((value) => {
          buckets[value - min] += 1;
        });

        const sortedBuckets = buckets.map((count, index) => {
          return { value: index + min, count };
        });

        acc[key] = sortedBuckets;
        return acc;
      }, {});

      setData(sortedValues);
      setLoading(false);
    }
    getData();
  }, [state, race, plan]);

  const data = dataBuckets ? dataBuckets[threshold] : [];

  const chartData = {
    options: {
      chart: {
        id: 'opportunity-district-chart',
      },
      xaxis: {
        title: {
          text: 'Number of Opportunity Districts',
        },
        categories: data.map((item) => item.value),
      },
      yaxis: {
        title: {
          text: `Number of Plans`,
        },
        labels: {
          formatter: function (value) {
            return value.toLocaleString();
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: [otherRacesColorMap[race]],
    },
    series: [
      {
        name: 'Number of Plans',
        data: data.map((item) => item.count),
      },
    ],
  };

  return (
    <div className='card-container'>
      <div className='d-flex align-items-center justify-content-around'>
        <Dropdown className='px-2 text-center'>
          <Dropdown.Toggle variant='primary' className='px-5 py-1'>
            {plan.toLocaleString()} Plans
          </Dropdown.Toggle>
          <Dropdown.Menu align='end'>
            <Dropdown.Item onClick={() => setPlan(250)}>250 Plans</Dropdown.Item>
            <Dropdown.Item onClick={() => setPlan(5000)}>5,000 Plans</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className='px-2 text-center'>
          <Dropdown.Toggle variant='success' className='px-5 py-1'>
            Threshold {threshold}%
          </Dropdown.Toggle>
          <Dropdown.Menu align='end'>
            <Dropdown.Item
              onClick={() => {
                setThreshold(37);
              }}>
              Threshold 37%
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setThreshold(44);
              }}>
              Threshold 44%
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setThreshold(50);
              }}>
              Threshold 50%
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          className='px-2 text-center'
          style={{
            backgroundColor: otherRacesColorMap[race],
            color: 'black',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
          }}>
          <Dropdown.Toggle
            variant='link'
            className='px-5 py-1'
            style={{
              backgroundColor: race !== 'None' ? 'transparent' : '#073b4c',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 550,
            }}>
            {race !== 'None' ? race : 'Choose a race to analyze'}
          </Dropdown.Toggle>
          <Dropdown.Menu align='end'>
            {Object.entries(otherRacesColorMap).map(([raceEntry, color]) => (
              <Dropdown.Item
                key={raceEntry}
                href='#'
                onClick={() => {
                  setRace(raceEntry);
                }}
                aria-selected={race === raceEntry}
                style={{
                  backgroundColor: race === raceEntry ? color : 'transparent',
                  transition: 'background-color 0.3s',
                  color: race === raceEntry ? 'white' : 'inherit',
                  fontWeight: race === raceEntry ? 'bolder' : 'inherit',
                }}>
                {raceEntry}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {!isLoading ? (
        <Chart options={chartData.options} series={chartData.series} type='bar' height={600} />
      ) : (
        <div style={{ marginBlock: '30vh' }}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default OpportunityDistrictGraph;
