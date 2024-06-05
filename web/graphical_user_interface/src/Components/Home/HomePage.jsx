import React, { useState, useEffect, useContext, createContext } from 'react';
import NavBar from './NavBar';
import AboutUsPage from './AboutUsPage';
import GinglesPage from '../States/GinglesPage';
import OverviewPage from '../States/OverviewPage';
import CompareRandomPlan from '../States/CompareRandomPlan';
import Heatmap from '../States/Heatmap'
import GerrymanderingGraph from '../Graphs/GerrymanderingGraph';;
import EcologicalInferenceGraph from '../Graphs/EcologicalInferenceGraph';
import WelcomePage from './WelcomePage';
import { ColorMap } from '../../Helpers/utils';
import * as Pages from './Pages';
import '../Graphs/graph.css';

export const ColorMapContext = createContext();

function HomePage() {
  const [page, setPage] = useState(Pages.WELCOME_PAGE);

  return (
    <ColorMapContext.Provider value={ColorMap}>
      <div style={{ height: '100vh', backgroundColor: '#F9F9F9' }}>
        <NavBar activateComponent={page} setActiveComponent={setPage} />
        {page === Pages.WELCOME_PAGE && <WelcomePage setActiveComponent={setPage} />}
        {page === Pages.ABOUT_US_PAGE && <AboutUsPage />}
        {Pages.isOverviewPage(page) && <OverviewPage state={Pages.getStateFromPage(page)} />}
        {Pages.isHeatmapPage(page) && <Heatmap state={Pages.getStateFromPage(page)} />}
        {Pages.isGerrymanderingPage(page) && <GerrymanderingGraph state={Pages.getStateFromPage(page)} />}
        {Pages.isGinglesPage(page) && <GinglesPage state={Pages.getStateFromPage(page)} />}
        {page === Pages.COMPARE_EI_PAGE && <EcologicalInferenceGraph />}
        {page === Pages.COMPARE_RANDOM_PAGE && <CompareRandomPlan />}
      </div>
    </ColorMapContext.Provider>
  );
}

export default HomePage;
