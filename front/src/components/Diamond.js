// src/components/Diamond.js
import React from 'react';
import DiamondImage from '../images/diamondBlue.png';

function Diamond({ top, left }) {
  return (
    <img
      className="Diamond"
      src={DiamondImage}
      alt="Diamond"
      style={{ position: 'absolute', top: `${top}px`, left: `${left}px`, width: '20px', height: '20px' }}
    />
  );
}

export default Diamond;
