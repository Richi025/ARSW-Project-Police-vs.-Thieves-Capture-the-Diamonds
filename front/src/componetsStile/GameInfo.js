// src/components/GameInfo.js
import React from 'react';
import styled from 'styled-components';
import Score from './Score';
import Lives from './Lives';

const GameInfoContainer = styled.div`
  background-color: white;
  border: 2px white;
  padding: 15px;
  margin-top: 30px;
  position: absolute;
  top: 40px;
  left: 40px;
`;

const GameInfoTitle = styled.h2`
  text-align: center;
  margin-bottom: 10px;
`;

const GameInfo = ({ score, thiefLives }) => {
  return (
    <GameInfoContainer>
      <GameInfoTitle>Game Info</GameInfoTitle>
      <Lives thiefLives={thiefLives} />
      <Score score={score} />
    </GameInfoContainer>
  );
};

export default GameInfo;

