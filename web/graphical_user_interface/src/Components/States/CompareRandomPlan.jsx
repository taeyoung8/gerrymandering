import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ColorMapContext } from '../Home/HomePage';
import Map from './Map';
import Dropdown from 'react-bootstrap/Dropdown';
import './sidebar.css';
import Loading from '../Loading/Loading';

const Legend = ({ colors }) => {
  return (
    <div className='container-fluid mt-2' style={{ width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${colors.length}, 1fr)`,
          height: '55px',
        }}>
        {colors.map((bin, step) => (
          <div
            key={step}
            style={{
              backgroundColor: bin.color,
              transition: 'background-color 0.5s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bolder',
              fontSize: '1.33em',
              color: 'black',
            }}>
            <span key={step}>
              {Math.round(bin.min * 100)}% - {Math.round(bin.max * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RaceHeatmap = ({ currentRace, handleRaceSelection, colorMap }) => {
  const [selectedRace, setSelectedRace] = useState(currentRace);

  const handleClick = (race) => {
    handleRaceSelection(race);
    setSelectedRace(race);
  };

  const handleMouseEnter = (event) => {
    event.target.style.backgroundColor = `${colorMap[event.target.innerText]}`;
    event.target.style.color = 'white';
  };

  const handleMouseLeave = (event) => {
    if (event.target.innerText !== selectedRace) {
      event.target.style.backgroundColor = '';
      event.target.style.color = '';
    }
  };

  return (
    <>
      <Dropdown
        className='px-2 text-center'
        style={{
          backgroundColor: colorMap[selectedRace],
          color: 'black',
          borderRadius: '5px',
          transition: 'background-color 0.3s',
        }}>
        <Dropdown.Toggle
          variant='link'
          className='px-5 py-1'
          style={{
            backgroundColor: selectedRace !== 'None' ? 'transparent' : '#073b4c',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 550,
          }}>
          {selectedRace !== 'None' ? selectedRace : 'Choose a race to analyze'}
        </Dropdown.Toggle>

        <Dropdown.Menu align='end'>
          {Object.entries(colorMap).map(([race, color]) => (
            <Dropdown.Item
              key={race}
              href='#'
              onClick={() => handleClick(race)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-selected={selectedRace === race}
              style={{
                backgroundColor: selectedRace === race ? color : 'transparent',
                transition: 'background-color 0.3s',
                color: selectedRace === race ? 'white' : 'inherit',
                fontWeight: selectedRace === race ? 'bolder' : 'inherit',
              }}>
              {race}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

function Heatmap({ state, mode, currentRace, selectedBounds, setSelectedBounds }) {
  const [geoJson, setGeoJson] = useState(undefined);
  const [stateCoords, setStateCoords] = useState(undefined);
  const [colors, setColors] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const response = await axios.get(`http://localhost:8080/state/hmap`, {
        params: {
          state: state,
          mode: mode,
        },
      });
      setGeoJson(response.data);
      setLoading(false);
    }

    async function getHeatMapColors() {
      const response = await axios.get(`http://localhost:8080/state/hlegend`, {
        params: {
          state: state,
          mode: mode,
          race: currentRace,
        },
      });
      setColors(response.data);
    }

    async function getStateCoords() {
      const response = await axios.get(`http://localhost:8080/state/coords`, {
        params: {
          state: state,
        },
      });
      setStateCoords(response.data);
    }
    getData();
    getHeatMapColors();
    getStateCoords();
  }, [state, currentRace, mode]);

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>
            {!isLoading && geoJson && stateCoords ? (
              <>
                <Map geojson={geoJson} centerCoords={stateCoords} selectedFeatureBounds={selectedBounds} setSelectedFeatureBounds={setSelectedBounds} race={currentRace} mode={mode} height={'75vh'} />
                <div className='row'>
                  <Legend colors={colors} />
                </div>
              </>
            ) : (
              <div className='d-flex align-items-center justify-content-center' style={{ height: '80vh' }}>
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const CompareRandomPlan = () => {
  const colorMap = useContext(ColorMapContext);
  const [selectedState, setSelectedState] = useState('MS');
  const [currentRace, setRace] = useState('Black');
  const [selectedBounds, setSelectedBounds] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('Random1');

  return (
    <>
      <div>
        <div className='container-fluid'>
          <div className='card-container d-flex align-items-center justify-content-center'>
            <h3 style={{ marginRight: '45%' }}>Compare with a Random Plan</h3>
            <Dropdown className='px-2 text-center'>
              <Dropdown.Toggle variant='primary' className='px-5 py-1'>
                {selectedState == 'NY' ? 'New York' : 'Mississippi'}
              </Dropdown.Toggle>
              <Dropdown.Menu align='end'>
                <Dropdown.Item
                  href='#'
                  onClick={() => {
                    setSelectedState('NY');
                  }}
                  aria-selected={selectedState === 'NY'}>
                  New York
                </Dropdown.Item>

                <Dropdown.Item
                  href='#'
                  onClick={() => {
                    setSelectedState('MS');
                  }}
                  aria-selected={selectedState === 'MS'}>
                  Mississippi
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className='px-2 text-center'>
              <Dropdown.Toggle variant='success' className='px-5 py-1'>
                {selectedPlan.slice(0, -1) + ' Plan ' + selectedPlan[selectedPlan.length - 1]}
              </Dropdown.Toggle>
              <Dropdown.Menu align='end'>
                <Dropdown.Item
                  href='#'
                  onClick={() => {
                    setSelectedPlan('Random1');
                  }}
                  aria-selected={selectedPlan === 'Random1'}>
                  Random Plan 1
                </Dropdown.Item>
                <Dropdown.Item
                  href='#'
                  onClick={() => {
                    setSelectedPlan('Random2');
                  }}
                  aria-selected={selectedPlan === 'Random2'}>
                  Random Plan 2
                </Dropdown.Item>
                <Dropdown.Item
                  href='#'
                  onClick={() => {
                    setSelectedPlan('Random3');
                  }}
                  aria-selected={selectedPlan === 'Random3'}>
                  Random Plan 3
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div
              style={{
                position: 'absolute',
                top: '118.5px',
                left: '64.25%',
                transform: 'translate(-50%, -50%)',
                zIndex: '500',
              }}>
              <RaceHeatmap currentRace={currentRace} handleRaceSelection={setRace} colorMap={colorMap} />
            </div>
          </div>
        </div>
        <div className='container-fluid' style={{ maxHeight: '25vh' }}>
          <div className='row'>
            <div className='col'>
              <Heatmap state={selectedState} mode={'District'} currentRace={currentRace} selectedBounds={selectedBounds} setSelectedBounds={setSelectedBounds} />
            </div>
            <div className='col'>
              <Heatmap state={selectedState} mode={selectedPlan} currentRace={currentRace} selectedBounds={selectedBounds} setSelectedBounds={setSelectedBounds} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareRandomPlan;
