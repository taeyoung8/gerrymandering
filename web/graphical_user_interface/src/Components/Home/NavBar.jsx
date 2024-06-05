import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import HornetsLogo from './../../images/hornets_logo.png';
import ResetIcon from './../../images/icons-reset-100.png';
import * as Pages from './Pages';
import './navbar.css';

function displayToast() {
  return toast.error('Page was reset', {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
}

function NavBar({ activateComponent, setActiveComponent }) {
  return (
    <Navbar bg='dark' expand='lg' variant='dark' className='mb-2'>
      <Container fluid className='px-5'>
        <Navbar.Brand>
          <div>
            <button className='custom-nav-brand' onClick={() => {
              setActiveComponent('Welcome');
              displayToast();
              }}>
              <img src={HornetsLogo} width='45' height='35' alt='' />
              <span style={{ color: 'white' }}> Hornets </span>
            </button>
            {Pages.isStatePage(activateComponent) &&
            <div className="btn-group" 
              role="group" 
              aria-label="Basic radio toggle button group"
              style={{ backgroundColor: 'white', marginLeft: 80 }}>
                <input type="radio" className="btn-check" id="btnNavTabOverview" checked={Pages.isOverviewPage(activateComponent)} onChange={() => setActiveComponent(Pages.getStateFromPage(activateComponent) === "NY" ? Pages.NY_OVERVIEW_PAGE : Pages.MS_OVERVIEW_PAGE)}/>
                <label className="btn btn-md btn-outline-primary" htmlFor="btnNavTabOverview">Overview</label>

                <input type="radio" className="btn-check" id="btnNavTabHeatmap" checked={Pages.isHeatmapPage(activateComponent)} onChange={() => setActiveComponent(Pages.getStateFromPage(activateComponent) === "NY" ? Pages.NY_HEATMAP_PAGE : Pages.MS_HEATMAP_PAGE)}/>
                <label className="btn btn-md btn-outline-primary" htmlFor="btnNavTabHeatmap">Heatmap</label>

                <input type="radio" className="btn-check" id="btnNavTabGerrymandering" checked={Pages.isGerrymanderingPage(activateComponent)} onChange={() => setActiveComponent(Pages.getStateFromPage(activateComponent) === "NY" ? Pages.NY_GERRYMANDERING_PAGE : Pages.MS_GERRYMANDERING_PAGE)}/>
                <label className="btn btn-md btn-outline-primary" htmlFor="btnNavTabGerrymandering">Gerrymandering</label>

                <input type="radio" className="btn-check" id="btnNavTabGingles" checked={Pages.isGinglesPage(activateComponent)} onChange={() => setActiveComponent(Pages.getStateFromPage(activateComponent) === "NY" ? Pages.NY_GINGLES_PAGE : Pages.MS_GINGLES_PAGE)}/>
                <label className="btn btn-md btn-outline-primary" htmlFor="btnNavTabGingles">Gingles 2/3</label>
            </div>}
          </div>
        </Navbar.Brand>

        <Nav className='ms-auto'>
          <NavDropdown
            title='States'
            className='custom-nav-item'
            id='collapsible-nav-dropdown'>
            <NavDropdown.Item onClick={() => setActiveComponent(Pages.NY_OVERVIEW_PAGE)}>
              New York
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => setActiveComponent(Pages.MS_OVERVIEW_PAGE)}>
              Mississippi
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown
            title='Compare'
            className='custom-nav-item'
            id='collapsible-nav-dropdown'>
            <NavDropdown.Item href='#' onClick={() => setActiveComponent(Pages.COMPARE_EI_PAGE)}>
              Ecological Inference
            </NavDropdown.Item>
            <NavDropdown.Item href='#' onClick={() => setActiveComponent(Pages.COMPARE_RANDOM_PAGE)}>
              Random Plan
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Item className='custom-nav-item'>
            <Nav.Link href='' onClick={() => setActiveComponent(Pages.ABOUT_US_PAGE)}>
              About Us
            </Nav.Link>
          </Nav.Item>

          <Nav.Item className='custom-nav-item' style={{ background: 'transparent' }}>
            <Nav.Link href='' className='btn btn-outline-danger' onClick={() => {
                setActiveComponent('Welcome');
                displayToast();
              }}>
              <img style={{ width: 20, height: 20, marginBottom: '5px' }} src={ResetIcon} alt='Reset' />
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
