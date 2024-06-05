import React, { useState, useContext, Children } from 'react';
import { ColorMapContext } from '../Home/HomePage';
import Dropdown from 'react-bootstrap/Dropdown';

const GraphComponentWrapper = ({state, title, setCurrentRace, children}) => {
  const colorMap = useContext(ColorMapContext);
  const [race, setRace] = useState('White');
  return (
    <>
      <div className='container-fluid'>
        <div className='card-container d-flex align-items-center justify-content-center'>
          <h3 style={{ marginRight: '50%' }}>{state === 'NY' ? 'New York' :(state === 'MS' ? 'Mississippi' : '')} {title}</h3>
          <h3 style={{ marginRight: '12px' }}>Race to Analyze:</h3>
          <Dropdown className='px-2 text-center' style={{
                backgroundColor: colorMap[race],
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
                fontWeight: 550
              }}>
              {race !== 'None' ? race : 'Choose a race to analyze'}
            </Dropdown.Toggle>
            <Dropdown.Menu align='end'>
              {
                Object.entries(colorMap).map(([raceEntry, color]) => (
                  <Dropdown.Item
                    key={raceEntry}
                    href="#"
                    onClick={() => {
                        setRace(raceEntry)
                        setCurrentRace(raceEntry)
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
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {children}
      </div>
    </>
  );
}


export default GraphComponentWrapper;
