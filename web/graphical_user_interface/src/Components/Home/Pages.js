export const WELCOME_PAGE = 'Welcome';
export const ABOUT_US_PAGE = 'About Us';
export const NY_OVERVIEW_PAGE = 'Overview.NY';
export const MS_OVERVIEW_PAGE = 'Overview.MS';
export const NY_HEATMAP_PAGE = 'Heatmap.NY';
export const MS_HEATMAP_PAGE = 'Heatmap.MS';
export const NY_GERRYMANDERING_PAGE = 'Gerrymandering.NY';
export const MS_GERRYMANDERING_PAGE = 'Gerrymandering.MS';
export const NY_GINGLES_PAGE = 'Gingles.NY';
export const MS_GINGLES_PAGE = 'Gingles.MS';
export const COMPARE_EI_PAGE = 'Compare.EI';
export const COMPARE_RANDOM_PAGE = 'Compare.Random';

export const getStateFromPage = (page) => page.split('.')[1];

export const isOverviewPage = (page) => page.startsWith('Overview');
export const isHeatmapPage = (page) => page.startsWith('Heatmap');
export const isGerrymanderingPage = (page) => page.startsWith('Gerrymandering');
export const isGinglesPage = (page) => page.startsWith('Gingles');
export const isStatePage = (page) => isOverviewPage(page) || isHeatmapPage(page) || isGerrymanderingPage(page) || isGinglesPage(page);