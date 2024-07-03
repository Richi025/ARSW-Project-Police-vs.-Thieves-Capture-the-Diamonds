// src/components/Score.js
import React from 'react';
import styled from 'styled-components';

// Estilos utilizando styled-components
const ScoreContainer = styled.div`
  background-color: red;
  color: white;
  padding: 10px;
  margin-top: 10px;
`;

const ScoreText = styled.div`
  font-size: 18px;
`;

const Score = ({ score }) => {
  return (
    <ScoreContainer>
      <ScoreText>Score: {score}</ScoreText>
    </ScoreContainer>
  );
};

export default Score;