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
          height: '10vh',
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
              {Math.round(bin.min*100)}% - {Math.round(bin.max*100)}%
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
            backgroundColor:
              selectedRace !== 'None' ? 'transparent' : '#073b4c',
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

function Heatmap({ state }) {
  const colorMap = useContext(ColorMapContext);
  const [geoJson, setGeoJson] = useState(undefined);
  const [stateCoords, setStateCoords] = useState(undefined);
  const [currentRace, setRace] = useState('White');
  const [currentMode, setMode] = useState('District');
  const [colors, setColors] = useState([]);
  const [selectedBounds, setSelectedBounds] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const response = await axios.get(`http://localhost:8080/state/hmap`, {
        params: {
          state: state,
          mode: currentMode,
        },
      });
      setGeoJson(response.data);
      setLoading(false);
    }

    async function getHeatMapColors() {
      const response = await axios.get(`http://localhost:8080/state/hlegend`, {
        params: {
          state: state,
          mode: currentMode,
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
  }, [state, currentRace, currentMode]);

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>
            {!isLoading && geoJson && stateCoords ? (
              <>
                <Map
                  geojson={geoJson}
                  centerCoords={stateCoords}
                  selectedFeatureBounds={selectedBounds}
                  setSelectedFeatureBounds={setSelectedBounds}
                  race={currentRace}
                  mode={currentMode}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '110px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '500',
                  }}>
                  <RaceHeatmap currentRace={currentRace} handleRaceSelection={setRace} colorMap={colorMap} />
                </div>
                <div className="btn-group" 
                    role="group" 
                    aria-label="Basic radio toggle button group"
                    style={{ backgroundColor: 'white', position: 'absolute',
                    top: '92px',
                    left: '85%',
                    zIndex: '500',
                    }}>
                      <input type="radio" className="btn-check" id="btnHeatmapTabDistrict" checked={currentMode === 'District'} onChange={() => setMode('District')}/>
                      <label className="btn btn-md btn-outline-primary" htmlFor="btnHeatmapTabDistrict">District</label>

                      <input type="radio" className="btn-check" id="btnHeatmapTabPrecinct" checked={currentMode === 'Precinct'} onChange={() => setMode('Precinct')}/>
                      <label className="btn btn-md btn-outline-primary" htmlFor="btnHeatmapTabPrecinct">Precinct</label>
                  </div>
                <div className='row'>
                  <Legend colors={colors} />
                </div>
              </>
            ) : (
              <div className='d-flex align-items-center justify-content-center' style={{ height: '90vh' }}>
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Heatmap;
