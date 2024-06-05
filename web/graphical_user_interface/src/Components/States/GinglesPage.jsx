import React, { useState } from 'react';
import GerrymanderingGraph from '../Graphs/GerrymanderingGraph';
import PrecinctAnalysisGraph from '../Graphs/PrecinctAnalysisGraph';
import Dropdown from 'react-bootstrap/Dropdown';
import GraphComponentWrapper from '../Graphs/GraphComponentWrapper';

function GinglesPage({ state }) {
  const [currentRace, setCurrentRace] = useState('White');

  return (
    <>
      <GraphComponentWrapper state={state} setCurrentRace={setCurrentRace} title={'Gingles Analysis'}>
        <PrecinctAnalysisGraph state={state} race={currentRace} />
      </GraphComponentWrapper>
    </>
  );
}

export default GinglesPage;