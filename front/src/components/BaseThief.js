// src/components/BaseThief.js
import React from 'react';
import baseThiefImage from '../images/baseThief.png'; 

function BaseThief({ top, left }) {
  return (
    <img
      className="BaseThief"
      src={baseThiefImage}
      alt="Base Thief"
      style={{ position: 'absolute', top: `${top}px`, left: `${left}px`, width: '100px', height: '200px' }}
    />
  );
}

export default BaseThief;
