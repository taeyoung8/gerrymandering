import React, { useState, useEffect, useContext } from 'react';
import { ColorMapContext } from './../Home/HomePage';
import Loading from '../Loading/Loading';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import FilterIcon from '../../images/icons_filter.svg';

function FilterModal({ setCurrentCandidate, setCurrentState }) {
  const [show, setShow] = useState(false);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState('all');

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setCurrentState(e.target.value);
  };

  const handleCandidateChange = (e) => {
    setSelectedCandidate(e.target.value);
    setCurrentCandidate(e.target.value);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant='transparent' onClick={handleShow}>
        <img src={FilterIcon} width={25} height={25} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='mb-3'>
              <Form.Label className='h4 font-weight-bold text-decoration-underline'>State</Form.Label>
              <Form.Check type='radio' id='filter-all-states' label='All States' value='all' checked={selectedState === 'all'} onChange={handleStateChange} />
              <Form.Check type='radio' id='filter-ny' label='New York' value='NY' checked={selectedState === 'NY'} onChange={handleStateChange} />
              <Form.Check type='radio' id='filter-ms' label='Mississippi' value='MS' checked={selectedState === 'MS'} onChange={handleStateChange} />
            </div>
            <div className='mb-3'>
              <Form.Label className='h4 font-weight-bold text-decoration-underline'>Candidate</Form.Label>
              <Form.Check type='radio' id='filter-all-candidates' label='All Candidates' value='all' checked={selectedCandidate === 'all'} onChange={handleCandidateChange} />
              <Form.Check type='radio' id='filter-democratic' label='Biden' value='Democratic' checked={selectedCandidate === 'Democratic'} onChange={handleCandidateChange} />
              <Form.Check type='radio' id='filter-republican' label='Trump' value='Republican' checked={selectedCandidate === 'Republican'} onChange={handleCandidateChange} />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const EcologicalInferenceGraph = () => {
  const colorMap = useContext(ColorMapContext);
  const [currentCandidate, setCurrentCandidate] = useState('all');
  const [currentState, setCurrentState] = useState('all');
  const [eiNumbers, setEINumbers] = useState({});
  const [isLoading, setLoading] = useState(true);

  const getDataPoints = (mean, interval) => {
    const stdDev = (interval[1] + 0.001 - (interval[0] - 0.001)) / 2;
    const points = [];
    for (let x = 0; x <= 1; x += 0.002) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
      points.push({ x: x, y: y });
    }
    return points;
  };

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const states = ['NY', 'MS'];
      const candidates = ['Democratic', 'Republican'];
      const queries = [];
      const data = {};
      states.forEach((state) => {
        data[state] = [];
        candidates.forEach((candidate) => {
          queries.push(
            axios.get(`http://localhost:8080/compare/ei`, {
              params: {
                state: state,
                party: candidate,
              },
            })
          );
        });
      });

      const results = await Promise.all(queries);
      results.forEach((result, _) => {
        data[result.data[0].state].push(result.data);
      });
      setEINumbers(data);
      setLoading(false);
    }
    getData();
  }, []);

  const options = {
    colors: Object.values(colorMap),
    stroke: {
      curve: 'smooth',
    },
    fill: {
      type: 'solid',
      opacity: 0.35,
    },
    xaxis: {
      title: {
        text: 'Score',
      },
      min: 0,
      max: 1,
      tickAmount: 6,
      labels: {
        formatter: function (val) {
          return val.toFixed(3);
        },
      },
    },
    markers: {
      size: 0,
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: [
      {
        title: {
          text: 'Probability Density',
        },
        labels: {
          formatter: function (val) {
            return val.toFixed(0);
          },
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return y.toFixed(2) + ' points';
          }
          return y;
        },
      },
    },
  };

  const height = currentState === 'all' ? 265 : 650;

  return (
    <div className='container-fluid'>
      <div className='card-container d-flex align-items-center justify-content-center'>
        <h3 style={{ marginRight: '70%' }}>Ecological Inference</h3>
        <h4 style={{ marginRight: '12px' }}>Filter:</h4>
        <div style={{ position: 'absolute', top: '95px', left: '92%' }}>
          <FilterModal setCurrentCandidate={setCurrentCandidate} setCurrentState={setCurrentState} />
        </div>
      </div>
      {!isLoading && eiNumbers ? (
        <>
          <div className='row'>
            {eiNumbers.MS &&
              (currentState == 'all' || currentState == 'MS') &&
              eiNumbers.MS.filter((item) => currentCandidate === 'all' || item[0].party === currentCandidate).map((item) => (
                <div key={item[0].state + item[0].party} className='card-container col'>
                  <h2>
                    Support for {item[0].party === 'Democratic' ? 'Biden' : 'Trump'} in {item[0].state}
                  </h2>
                  <Chart
                    options={options}
                    series={item.map((data) => ({
                      name: data.race,
                      data: getDataPoints(data.raceMean, [data.raceLowerInterval, data.raceUpperInterval]),
                    }))}
                    type='area'
                    height={height}
                  />
                </div>
              ))}
          </div>
          <div className='row'>
            {eiNumbers.NY &&
              (currentState == 'all' || currentState == 'NY') &&
              eiNumbers.NY.filter((item) => currentCandidate === 'all' || item[0].party === currentCandidate).map((item) => (
                <div key={item[0].state + item[0].party} className='card-container col'>
                  <h2>
                    Support for {item[0].party === 'Democratic' ? 'Biden' : 'Trump'} in {item[0].state}
                  </h2>
                  <Chart
                    options={options}
                    series={item.map((data) => ({
                      name: data.race,
                      data: getDataPoints(data.raceMean, [data.raceLowerInterval, data.raceUpperInterval]),
                    }))}
                    type='area'
                    height={height}
                  />
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className='d-flex align-items-center justify-content-center' style={{ height: '50vh' }}>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default EcologicalInferenceGraph;
