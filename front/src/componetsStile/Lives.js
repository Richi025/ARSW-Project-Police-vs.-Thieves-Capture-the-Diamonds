// src/components/Lives.js
import React from 'react';
import styled from 'styled-components';
import heartImage from '../images/heart.png';

// Define los estilos utilizando styled-components
const LivesContainer = styled.div`
  display: flex;
  padding: 20px;
  margin-top: 20px;
  position: flex;
  top: 100px;
  left: 100px;
  span {
    margin-right: 10px;
  }

  .heart-icon {
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }
`;

const Lives = ({ thiefLives }) => {
  return (
    <LivesContainer>
      <span>Thief Lives:</span>
      {[...Array(thiefLives)].map((_, index) => (
        <img key={index} src={heartImage} alt="Heart" className="heart-icon" />
      ))}
    </LivesContainer>
  );
};

export default Lives;
