import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { Scatter } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const PrecinctAnalysisGraph = ({ state, race }) => {
  const highlightedRowRef = useRef(null);
  const [demDataPoints, setDemDataPoints] = useState([]);
  const [repDataPoints, setRepDataPoints] = useState([]);
  const [demRegressionLine, setDemLine] = useState([]);
  const [repRegressionLine, setRepLine] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    async function getTableData() {
      const response = await axios.get(`http://localhost:8080/state/precincts`, {
        params: {
          state: state,
        },
      });
      setTableData(response.data);
    }
    getTableData(); // Only need to query if the state changes
  }, [state]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(`http://localhost:8080/state/gingles`, {
        params: {
          state: state,
          race: race,
        },
      });
      const demData = response.data[0];
      const repData = response.data[1];

      setDemDataPoints(demData.scatterX.map((x, i) => ({ x, y: demData.scatterY[i] })));
      setDemLine(fitExponentialCurve(demData.nonLinearA, demData.nonLinearB, demData.nonLinearC));

      setRepDataPoints(repData.scatterX.map((x, i) => ({ x, y: repData.scatterY[i] })));
      setRepLine(fitExponentialCurve(repData.nonLinearA, repData.nonLinearB, repData.nonLinearC));
      if (highlightedRowRef.current) {
        highlightedRowRef.current.classList.remove('table-info');
        const table = document.querySelector('.table tbody tr');
        table.scrollIntoView({ top: 0 }); // Reset back to the first row
        highlightedRowRef.current = null;
      }
    }
    getData();
  }, [state, race]);

  const fitExponentialCurve = (coeffA, coeffB, coeffC) => {
    const x = Array.from({ length: 101 }, (_, i) => i/100); // Generate points in range[0, 1]
    let f;
    if (race === 'Hispanic' || race === 'Asian') {
      f = (x) => coeffA * Math.exp(-coeffB * x);
    } else {
      f = (x) =>  coeffA / (1 + Math.exp(-coeffB * (x - coeffC)))
    }

    return x.map((val) => ({
      x: val,
      y: f(val),
    }));
  };

  const data = {
    datasets: [
      {
        label: 'Democratic Points',
        data: demDataPoints,
        showLine: false,
        fill: false,
        borderColor: '#6495ED',
        backgroundColor: '#6495ED',
        pointRadius: 2,
        order: 3,
      },
      {
        label: 'Republican Points',
        data: repDataPoints,
        showLine: false,
        fill: false,
        borderColor: '#FF5C5F',
        backgroundColor: '#FF5C5F',
        pointRadius: 2,
        order: 4,
      },
      {
        label: 'Democratic Regression Line',
        data: demRegressionLine,
        showLine: true,
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'blue',
        pointRadius: 0,
        order: 1,
      },
      {
        label: 'Republican Regression Line',
        data: repRegressionLine,
        showLine: true,
        fill: false,
        borderColor: 'red',
        backgroundColor: 'red',
        pointRadius: 0,
        order: 2,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: `Percent ${race}`,
        },
        min: 0,
        max: 1,
        ticks: {
          stepSize: .25,
          callback: function (val) {
            return (val * 100).toFixed(0) + "%";
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Vote Share',
        },
        max: 1,
        ticks: {
          callback: function (val) {
            return (val * 100).toFixed(0) + "%";
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `(${(context.parsed.x * 100).toFixed(0)}%, ${(context.parsed.y * 100).toFixed(0)}%)`;
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div>
      {demDataPoints.length > 0 ? (
        <div className='row'>
          <div id='chart' className='card-container col'>
            <Scatter
              data={data}
              options={{
                ...options,
                onClick: (_, elements) => {
                  if (elements.length > 0) {
                    const element = elements[0];
                    const row = document.querySelector(`.table tbody tr:nth-child(${element.index + 1})`);
                    if (highlightedRowRef.current) {
                      highlightedRowRef.current.classList.remove('table-info');
                    }
                    row.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                    highlightedRowRef.current = row;
                    highlightedRowRef.current.classList.add('table-info');
                  }
                },
              }}
              key={race}
              height={'180px'}
            />
          </div>
          <div className='card-container col' style={{ flex: '0 0 545px' }}>
            <h3 className='title-text'>{state === 'NY' ? 'New York' : 'Mississippi'} Precinct Data</h3>
            <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Precinct</th>
                    <th scope='col'>Total Population</th>
                    <th scope='col'>{race} Population</th>
                    <th scope='col'>Democratic Votes</th>
                    <th scope='col'>Republican Votes</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <tr id={index} key={index}>
                          <th scope='row'>{item.precinct + 1}</th>
                          <td align='right'>{item.population.toLocaleString()}</td>
                          <td align='right'>{item[`population${race}`].toLocaleString()}</td>
                          <td align='right'>{item.votes2020Democratic}</td>
                          <td align='right'>{item.votes2020Republican}</td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ height: '60vh' }}>
                        <td colSpan='20' className='text-center'>
                          Data Unavailable
                        </td>
                      </tr>
                    )}
                  </>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className='d-flex align-items-center justify-content-center' style={{ height: '75vh' }}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default PrecinctAnalysisGraph;
