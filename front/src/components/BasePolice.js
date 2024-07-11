import React from 'react';
import basePoliceImage from '../images/basePolice.png';

const BasePolice = ({ x, y }) => {
  return (
    <img
      className="BasePolice"
      src={basePoliceImage}
      alt="Base Police"
      style={{ position: 'absolute', top: `${y}px`, left: `${x}px`, width: '100px', height: '200px' }}
    />
  );
};

export default BasePolice;
