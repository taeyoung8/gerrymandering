import React from 'react';
import HornetsLogo from './../../images/hornets_logo.png';
import BackgroundImage from './../../images/background_image.svg';

const listStyle = {
  padding: '15px 20px',
  backgroundColor: 'whitesmoke',
  marginBottom: '15px ',
  borderRadius: '20px',
};

function AboutUsPage() {
  return (
    <div>
      <section id='about' className='py-5'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <h1 style={{ fontWeight: 'bold', marginBottom: '24px' }}>
                Team Members
              </h1>
              <div className='row' style={listStyle}>
                Kamrul Hassan
              </div>
              <div className='row' style={listStyle}>
                Haris Khan
              </div>
              <div className='row' style={listStyle}>
                Tae Young Kim
              </div>
              <div className='row' style={listStyle}>
                Nicholas Logozzo
              </div>
              </div>
              <div className='col-md-6 text-center'>
                <img
                  style={{
                    display: 'block',
                    margin: 'auto',
                    marginTop: '75px',
                    width: '50%',
                    height: '65%',
                  }}
                  src={HornetsLogo}
                  width='128'
                  height='128'
                  alt=''
                />
            </div>
          </div>
        </div>
        <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '50vh',
              backgroundImage: `url(${BackgroundImage})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              opacity: '.9',
            }}
          />
      </section>
    </div>
  );
}

export default AboutUsPage;
