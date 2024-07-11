// src/components/GameOver.js
import React from 'react';
import styled from 'styled-components';

const GameOverContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MessageContainer = styled.div`
  text-align: center;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  max-width: 80%;
`;

const Title = styled.h1`
  color: ${({ policeWin }) => (policeWin ? 'blue' : 'red')};
  font-size: 2em;
  margin-bottom: 20px;
`;

const FinalScore = styled.div`
  font-size: 1.5em;
`;

const GameOver = ({ score, howWin }) => {
  return (
    <GameOverContainer>
      <MessageContainer>
        <Title policeWin={howWin !== "thief"}>
          {howWin !== "thief" ? 'Ganaron los policías' : 'Ganaron los ladrones'}
        </Title>
        <FinalScore>Score: {score}</FinalScore>
      </MessageContainer>
    </GameOverContainer>
  );
};

export default GameOver;


