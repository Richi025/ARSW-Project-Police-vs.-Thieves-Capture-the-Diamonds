import React from 'react';
import DiamondImage from '../images/diamondBlue.png';

const Diamond = ({ x, y }) => {
  return (
    <img
      className="Diamond"
      src={DiamondImage}
      alt="Diamond"
      style={{ position: 'absolute', top: `${y}px`, left: `${x}px`, width: '20px', height: '20px' }}
    />
  );
};

export default Diamond;
