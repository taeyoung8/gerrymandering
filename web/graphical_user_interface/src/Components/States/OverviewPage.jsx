import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from './Map';
import AssemblyDistrictGraph from '../Graphs/StateAssembly/AssemblyDistrictGraph';
import EthnicityStateAssemblyGraph from '../Graphs/StateAssembly/EthnicityStateAssemblyGraph';
import Dropdown from 'react-bootstrap/Dropdown';
import './sidebar.css';
import Loading from '../Loading/Loading';
import OpportunityDistrictGraph from '../Graphs/OpportunityDistrictGraph';
import StateVoteSplit from '../Graphs/StateVoteSplit';

function OverviewPage({ state }) {
  const [geoJson, setGeoJson] = useState(undefined);
  const [stateCoords, setStateCoords] = useState(undefined);
  const [sidebarPage, setSidebarPage] = useState('Ethnicity of State Assembly');
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    async function getGeoJson() {
      const response = await axios.get(`http://localhost:8080/state/plan`, {
        params: {
          state: state,
        },
      });
      setGeoJson(response.data);
    }

    async function getStateCoords() {
      const response = await axios.get(`http://localhost:8080/state/coords`, {
        params: {
          state: state,
        },
      });
      setStateCoords(response.data);
    }

    setSidebarPage('Ethnicity of State Assembly');
    getGeoJson();
    getStateCoords();
  }, [state]);

  useEffect(() => {
    if (sidebarPage !== 'District Information') {
      setSelectedDistrict(null);
    } else if (sidebarPage === 'District Information' && selectedDistrict === null) {
      setSelectedDistrict(0);
    }
  }, [sidebarPage]);

  useEffect(() => {
    if (selectedDistrict !== null) {
      setSidebarPage('District Information');
    }
  }, [selectedDistrict]);

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-6'>
            {geoJson && stateCoords ? (
              <div>
                <Map geojson={geoJson} centerCoords={stateCoords} selectedFeatureBounds={selectedDistrict} setSelectedFeatureBounds={setSelectedDistrict} race={undefined} mode={'District'} />
                <table className='table table-bordered border border-secondary shadow'>
                  <tbody>
                    <tr>
                      <th scope='row' className='text-center' colSpan={2}>
                        Ensemble 1
                      </th>

                      <th scope='row' className='text-center' colSpan={2}>
                        Ensemble 2
                      </th>
                    </tr>
                    <tr>
                      <td align='center'>250 plans</td>
                      <td align='center'>0.08 Population Equality Threshold</td>

                      <td align='center'>5,000 plans</td>
                      <td align='center'>0.08 Population Equality Threshold</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <Loading />
            )}
          </div>

          <div className='col-6' style={{ height: '90vh' }}>
            <Dropdown className='text-center'>
              <Dropdown.Toggle
                className='btn btn-outline-secondary'
                variant='outline-secondary'
                id='dropdownMenuButton'
                style={{
                  backgroundColor: '#073b4c',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 550,
                }}>
                {sidebarPage}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href='#' onClick={() => setSidebarPage('Ethnicity of State Assembly')}>
                  Ethnicity of State Assembly
                </Dropdown.Item>
                <Dropdown.Item href='#' onClick={() => setSidebarPage('District Information')}>
                  District Information
                </Dropdown.Item>
                <Dropdown.Item href='#' onClick={() => setSidebarPage('Opportunity Districts')}>
                  Opportunity Districts
                </Dropdown.Item>
                <Dropdown.Item href='#' onClick={() => setSidebarPage('Vote Splits')}>
                  Vote Splits
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {sidebarPage === 'Ethnicity of State Assembly' && <EthnicityStateAssemblyGraph state={state} setSelectedDistrict={setSelectedDistrict} />}
            {sidebarPage === 'District Information' && <AssemblyDistrictGraph state={state} selectedDistrict={selectedDistrict} />}
            {sidebarPage === 'Opportunity Districts' && <OpportunityDistrictGraph state={state} />}
            {sidebarPage === 'Vote Splits' && <StateVoteSplit state={state} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default OverviewPage;
