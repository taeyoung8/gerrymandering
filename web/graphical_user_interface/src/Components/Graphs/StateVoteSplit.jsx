import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';

const StateVoteSplit = ({ state }) => {
  const [data, setData] = useState({});
  const [plan, setPlan] = useState(5000);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(`http://localhost:8080/state/splits`, {
        params: {
          state: state,
          ensemble: plan,
        },
      });
      const aggregatedData = response.data.reduce((acc, item) => {
        const repDemSplits = item.repDemSplit;
        Object.keys(repDemSplits).forEach((key) => {
          if (acc.hasOwnProperty(key)) {
            acc[key] += repDemSplits[key];
          } else {
            acc[key] = repDemSplits[key];
          }
        });
        return acc;
      }, {});
      const sortedData = Object.entries(aggregatedData).sort((a, b) => {
        const [aStart, aEnd] = a[0].split('-').map(Number);
        const [bStart, bEnd] = b[0].split('-').map(Number);
        const aDifference = Math.abs(aEnd - aStart);
        const bDifference = Math.abs(bEnd - bStart);
        if (aDifference !== bDifference) {
          return aDifference - bDifference;
        } else {
          return bStart - aStart;
        }
      });
      setData(Object.fromEntries(sortedData));
    }
    getData();
  }, [state, plan]);

  return (
    <div className='card-container'>
      <div className='d-flex align-items-center justify-content-between'>
        <h3 className='title-text'>{state === 'NY' ? 'New York' : 'Mississippi'} Vote Splits</h3>
        <Dropdown className='px-2 text-center'>
          <Dropdown.Toggle variant='primary' className='px-5 py-1'>
            {plan.toLocaleString()} Plans
          </Dropdown.Toggle>
          <Dropdown.Menu align='end'>
            <Dropdown.Item onClick={() => setPlan(250)}>250 Plans</Dropdown.Item>
            <Dropdown.Item onClick={() => setPlan(5000)}>5,000 Plans</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div style={{ maxHeight: '72ch', overflow: 'auto' }}>
        <table className='table'>
          <thead>
            <tr>
              <th>Republican-Democratic Split</th>
              <th>Number of Districts</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              Object.entries(data).map(([split, votes]) => (
                <tr key={split}>
                  <td>{split}</td>
                  <td>{votes.toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StateVoteSplit;
