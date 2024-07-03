// src/components/BasePolice.js
import React from 'react';
import basePoliceImage from '../images/basePolice.png';

function BasePolice({ top, left }) {
  return (
    <img
      className="BasePolice"
      src={basePoliceImage}
      alt="Base Police"
      style={{ position: 'absolute', top: `${top}px`, left: `${left}px`, width: '100px', height: '200px' }}
    />
  );
}

export default BasePolice;