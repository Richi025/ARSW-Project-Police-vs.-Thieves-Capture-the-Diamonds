// src/components/Obstacle.js
import React from 'react';
import obstacleImage from '../images/obstaculeBox.jpg'; // Asegúrate de tener una imagen para los obstáculos

const Obstacle = ({ x, y }) => {
  return (
    <img
      className="Obstacle"
      src={obstacleImage}
      alt="Obstacle"
      style={{position: 'absolute', top: `${y}px`, left: `${x}px`, width: '50px', height: '50px'}}
    />
  );
};

export default Obstacle;
