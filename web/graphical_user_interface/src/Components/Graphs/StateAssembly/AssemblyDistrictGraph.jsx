import React, { useState, useEffect, useContext } from 'react';
import Loading from '../../Loading/Loading';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale,
  LinearScale, BarElement, Title,
  Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend);

const AssemblyDistrictGraph = ({ state, selectedDistrict }) => {
    const [districtData, setDistrictData] = useState({});
    const [totalPopulation, setTotalPopulation] = useState(0);
    const [totalVotes, setTotalVotes] = useState(0);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);

        async function getDistrictData() {
            function getDataByKeyPrefix(data, prefix) {
                return data
                    .filter(([key, value]) => key.startsWith(prefix))
                    .reduce((acc, [key, value]) => {
                    const newKey = key.replace(prefix, '');
                    if (newKey.length > 0){
                      acc[newKey] = value;
                    }
                    return acc;
                    }, {});
            }

            const response = await axios.get(`http://localhost:8080/state/dinfo`, {
                params: {
                state: state,
                district: selectedDistrict + 1,
                },
            });
            const queryResponse = Object.entries(response.data);
            setTotalPopulation(response.data.population);
            setTotalVotes(response.data.votes2020);
            const ethnicData = getDataByKeyPrefix(queryResponse, 'population');
            const votingData = getDataByKeyPrefix(queryResponse, 'votes2020');
            const data = {
                ethnicity: {
                labels: Object.keys(ethnicData),
                datasets: [
                    {
                    label: `Population of District ${selectedDistrict + 1}`,
                    data: Object.values(ethnicData),
                    backgroundColor: [
                        '#118AB2',
                        '#FFD366',
                        '#06D6A0',
                        '#EF476F',
                    ],
                    },
                ],
                },
                votes: {
                labels: ['Democratic', '', 'Republican'],
                datasets: [
                    {
                    label: `Votes in District ${selectedDistrict + 1}`,
                    data: [votingData.Democratic, 0,  votingData.Republican],
                    backgroundColor: ['#008ef3','#ffffff' ,'#e81b23'],
                    },
                ],
                },
            };
            setDistrictData(data);
        }

        getDistrictData();
        setLoading(false);
      }, [selectedDistrict]);

    return (
        <>
          <div className='container-fluid'>
            <div className='row'>
              <div key={state} className='col'>
                <div className='card-container'>
                  {!isLoading && Object.keys(districtData).length > 0 ? (
                    <>
                      <h2 className='title-text'>
                        District {selectedDistrict + 1} Population
                      </h2>
                      <h6 className = 'text-center'  style={{ marginTop: 6, color: '#a7a7a7', fontWeight: 600 }}>
                        Total Population: {totalPopulation.toLocaleString()}
                      </h6>
                      <Bar
                        style={{ width: '100%' }}
                        height={'125'}
                        data={districtData.ethnicity}
                        options={{
                          responsive: true,
                          animation: {
                            animateScale: true,
                            animateRotate: true,
                          },
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }}/>
                      <h2 className='title-text'>
                        District {selectedDistrict + 1} Votes
                      </h2>
                      <h6 className = 'text-center'  style={{ marginTop: 6, color: '#a7a7a7', fontWeight: 600 }}>
                        Total Votes: {totalVotes.toLocaleString()}
                      </h6>
                      <Bar
                        style={{ width: '100%'}}
                        height={'120'}
                        data={districtData.votes}
                        options={{
                          responsive: true,
                          animation: {
                            animateScale: true,
                            animateRotate: true,
                          },
                          plugins: {
                            legend: {
                              display: false
                            }
                          },
                        }}/>
                    </>
                  ) : (
                    <div style={{ marginBlock: '15vh' }}>
                      <Loading />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
    )
}

export default AssemblyDistrictGraph;