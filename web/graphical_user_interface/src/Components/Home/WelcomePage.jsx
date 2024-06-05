import React from 'react';
import NYFlag from './../../images/ny_flag.png';
import MSFlag from './../../images/ms_flag.png';
import * as Pages from './Pages';
import './../Graphs/graph.css';

const WelcomePage = ({ setActiveComponent }) => {
  return (
    <div className='d-flex justify-content-center align-items-center gap-5 h-75'>
      <div className='container'>
        <div className='row text-center card-container'>
          <div
            className='column d-flex flex-column justify-content-center align-items-center gap-2'
            style={{
              maxWidth: '50%',
              background: `linear-gradient(rgba(255,255,255,.33), rgba(255,255,255,.33)), url(${NYFlag})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              marginTop: '15vh',
              height: '85vh',
            }}>
            <img
              src='https://worldpopulationreview.com/state-outlines/ny/outline-ny-1400w.png'
              style={{
                width: '512px',
                height: '354px',
                filter: 'invert(80%)',
              }}
              alt='New York'
            />
            <button
              className='btn btn-lg btn-info text-black'
              onClick={() => {
                setActiveComponent(Pages.NY_OVERVIEW_PAGE);
              }}>
              New York
            </button>
            <div className='h3 fw-light bg-white p-2 shadow rounded'>
              A non-preclearance state
            </div>
          </div>
          <div
            className='column d-flex flex-column justify-content-center align-items-center gap-2'
            style={{
              maxWidth: '50%',
              background: `linear-gradient(rgba(255,255,255,.33), rgba(255,255,255,.33)), url(${MSFlag})`,
              borderLeft: '1px solid darkgray',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              marginTop: '15vh',
              height: '85vh',
            }}>
            <img
              src='https://worldpopulationreview.com/state-outlines/ms/outline-ms-600w.png'
              style={{
                width: '350px',
                height: '354px',
                filter: 'invert(80%)',
              }}
              alt='Mississippi'
            />
            <button
              className='btn btn-lg btn-info'
              onClick={() => {
                setActiveComponent(Pages.MS_OVERVIEW_PAGE);
              }}>
              Mississippi
            </button>
            <div className='h3 fw-light bg-white p-2 shadow rounded'>
              A preclearance state
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
