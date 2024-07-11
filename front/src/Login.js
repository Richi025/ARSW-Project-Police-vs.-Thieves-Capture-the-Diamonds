import React, { useState } from 'react';
import styled from 'styled-components';
import Game from '../src/components/Game';
import facadeImage from '../src/images/Fondo.jpg';
import axios from 'axios';
import config from '../src/config/config';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #282c34;
`;

const FacadeImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  margin-bottom: 20px;
  border: 2px solid black;
`;

const StartButton = styled.button`
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  font-size: 1em;
`;

const Login = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('thief');
  const [player, setPlayer] = useState(null);

  const startGame = async () => {
    if (name) {
      try {
        const initialPosition = role === 'thief' ? { top: 5, left: 5 } : { top: 150, left: 250 }; // Posiciones iniciales para cada rol
        const playerData = { 
          name, 
          top: initialPosition.top, 
          left: initialPosition.left, 
          direction: 'stayRight', 
          isThief: role === 'thief', 
          score: 0,
          initialTop: initialPosition.top, // Asegurarse de pasar la posición inicial
          initialLeft: initialPosition.left // Asegurarse de pasar la posición inicial
        };
        const response = await axios.post(`${config.BASE_URL}/api/games/1/players`, playerData);
        console.log('Player created:', response.data);
        setPlayer(response.data);
        setGameStarted(true);
      } catch (error) {
        console.error('Error creating player:', error);
      }
    } else {
      alert('Please enter a name');
    }
  };

  return (
    <LoginContainer>
      {!gameStarted ? (
        <>
          <FacadeImage src={facadeImage} alt="Facade" />
          <Input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <label>
              <input type="radio" value="thief" checked={role === 'thief'} onChange={() => setRole('thief')} />
              Thief
            </label>
            <label>
              <input type="radio" value="police" checked={role === 'police'} onChange={() => setRole('police')} />
              Police
            </label>
          </div>
          <StartButton onClick={startGame}>Jugar</StartButton>
        </>
      ) : (
        <Game player={player} />
      )}
    </LoginContainer>
  );
};

export default Login;
