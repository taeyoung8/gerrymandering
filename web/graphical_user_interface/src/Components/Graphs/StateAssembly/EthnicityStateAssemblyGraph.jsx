import React, { useState, useEffect, useContext } from 'react';
import Loading from '../../Loading/Loading';
import PhotoModal from './AssemblyPhotoModal';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale,
  LinearScale, BarElement, Title,
  Tooltip, Legend } from 'chart.js';
import { ColorMapContext } from '../../Home/HomePage';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend);

const EthnicityStateAssemblyGraph = ({ state, setSelectedDistrict }) => {
  const colorMap = useContext(ColorMapContext);
  const [repData, setRepData] = useState([]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [repPhotoUrl, setRepPhotoUrl] = useState('');
  const [repName, setRepName] = useState('');
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    async function getRepData() {
      const response = await axios.get(`http://localhost:8080/state/reps`, {
        params: {
          state: state,
        },
      });
      setRepData(response.data);
    }
    async function getGraphData() {
      const response = await axios.get(
        `http://localhost:8080/state/ethnicity`,
        {
          params: {
            state: state,
          },
        }
      );
      const data = {
        labels: response.data.labels,
        datasets: [
          {
            label: '% Assembly Members',
            data: response.data.assembly,
            backgroundColor: '#118ab2',
          },
          {
            label: '% Overall Population',
            data: response.data.overall,
            backgroundColor: '#073b4c',
          },
        ],
      };
      setGraphData(data);
    }
    getRepData();
    getGraphData();
    setIsLoading(false);
  }, [state]);

  const options = {
    responsive: true,
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Ethnicity of House Representatives',
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };
  
  const filteredData = repData
                      .filter(rep => selectedParty ? rep.party === selectedParty : true)
                      .filter(rep => selectedRace ? rep.race === selectedRace : true);

  return (
    <>
      {!showPhotoModal && (
        <div className='container-fluid'>
          <div className='row'>
            <div key={state} className='col'>
              <div className='card-container'>
                {!isLoading ? (
                  <>
                    <h2 className='title-text'>
                      {state === 'NY' ? 'New York' : 'Mississippi'}
                    </h2>
                    <Bar
                      style={{ width: '100%' }}
                      data={graphData}
                      options={options}
                    />
                  </>
                ) : (
                  <div style={{ marginBlock: '20vh' }}>
                    <Loading />
                  </div>
                )}
              </div>
              <div className='card-container'>
                {!isLoading ? (
                  <>
                    <h3 className='title-text'>
                      {state === 'NY' ? 'New York' : 'Mississippi'} Members
                    </h3>
                    <div style={{ maxHeight: '25vh', overflow: 'auto' }}>
                      <table className='table table-hover'>
                        <thead>
                          <tr>
                            <th scope='col'>District</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>
                                <span>Party</span>
                                <Dropdown className='d-inline-block' style={{height: '0'}}>
                                  <Dropdown.Toggle variant="transparent" id="dropdown-basic" />
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{setSelectedParty('')}}>All Parties</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{setSelectedParty('Democratic')}}>Democratic</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>{setSelectedParty('Republican')}}>Republican</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                            </th>
                            <th scope='col'>
                                <span>Race</span>
                                <Dropdown className='d-inline-block' style={{height: '0'}}>
                                  <Dropdown.Toggle variant="transparent" id="dropdown-basic" />
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{setSelectedRace('')}}>All Races</Dropdown.Item>
                                    {Object.entries(colorMap).map(([race, _]) => (
                                      <Dropdown.Item key={race} onClick={() => setSelectedRace(race)}>
                                        {race}
                                      </Dropdown.Item>
                                    ))}
                                  </Dropdown.Menu>
                                </Dropdown>
                            </th>
                            <th scope='col'>Vote Margin</th>
                            <th scope='col'>Photo</th>
                          </tr>
                        </thead>
                        <tbody>
                          <>
                            {filteredData.length > 0 ? filteredData
                            .map((rep, index) => (
                                <tr
                                  title='Click to view a specific district'
                                  key={index}
                                  onClick={() => {
                                    setSelectedDistrict(index);
                                  }}>
                                  <th scope='row'>{rep.district}</th>
                                  <td>{rep.name}</td>
                                  <td>{rep.party}</td>
                                  <td>{rep.race}</td>
                                  <td>{(rep.voteMargin * 100).toFixed(1)}%</td>
                                  <td>
                                    <a href='#' onClick={(e) => {
                                        e.stopPropagation(); // Prevent Event Bubbling
                                        setRepName(rep.name);
                                        setRepPhotoUrl(rep.imageUrl);
                                        setShowPhotoModal(true);
                                      }}>
                                        View 
                                      </a>
                                  </td>
                                </tr>
                              )):
                              <tr style={{height: '25vh'}}>
                                <td colSpan='20' className='text-center'>No data found</td>
                              </tr>
                              }
                          </>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div style={{ marginBlock: '10vh' }}>
                    <Loading />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showPhotoModal && <PhotoModal repName={repName} repPhotoUrl={repPhotoUrl} setShowPhotoModal={setShowPhotoModal} />}
    </>
  );
};

export default EthnicityStateAssemblyGraph;
