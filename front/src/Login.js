// src/components/Login.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Game from './components/Game';
import facadeImage from './Fondo.jpg';

// Estilos utilizando styled-components
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #282c34; /* Color de fondo */
`;

const FacadeImage = styled.img`
  max-width: 100%;
  max-height: 70vh; /* Tamaño máximo de la imagen */
  margin-bottom: 20px;
  border: 2px solid black; /* Borde negro */
`;

const StartButton = styled.button`
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #4CAF50; /* Color de fondo verde */
  color: white; /* Texto blanco */
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049; /* Cambio de color al pasar el ratón */
  }
`;

const Login = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <LoginContainer>
      {!gameStarted ? (
        <>
          <FacadeImage src={facadeImage} alt="Facade" />
          <StartButton onClick={startGame}>Jugar</StartButton>
        </>
      ) : (
        <Game />
      )}
    </LoginContainer>
  );
};

export default Login;
