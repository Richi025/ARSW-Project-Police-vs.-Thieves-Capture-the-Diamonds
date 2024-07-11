import React from 'react';
import baseThiefImage from '../images/baseThief.png';

const BaseThief = ({ x, y }) => {
  return (
    <img
      className="BaseThief"
      src={baseThiefImage}
      alt="Base Thief"
      style={{ position: 'absolute', top: `${y}px`, left: `${x}px`, width: '100px', height: '200px' }}
    />
  );
};

export default BaseThief;
