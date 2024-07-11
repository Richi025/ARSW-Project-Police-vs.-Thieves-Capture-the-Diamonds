// src/components/Game.js
import React, { useState, useEffect, useRef  } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Player from './Player';
import Diamond from './Diamond';
import BaseThief from './BaseThief';
import BasePolice from './BasePolice';
import Obstacle from './Obstacle';
import axios from 'axios';
import config from '../config/config';
import GameInfo from '../componetsStile/GameInfo';
import GameOver from '../componetsStile/GameOver';

const Game = ({ player }) => {
  const [gameState, setGameState] = useState([]);
  const [players, setPlayers] = useState([player]);
  const [playerDirection, setPlayerDirection] = useState(player.direction);
  const [thiefLives, setThiefLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [howWin, setHowWin] = useState('police');
  const [score, setScore] = useState(player.score);
  const animationRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://localhost:8080/game-websocket`,
      connectHeaders: {
        login: 'user',
        passcode: 'password'
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS(config.socketUrl),
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      client.subscribe('/topic/game-state', (message) => {
        const gameState = JSON.parse(message.body);
        console.log('Received game state from backend:', gameState);
        setGameState(Array.isArray(gameState) ? gameState : []);
        logGameStateMatrix(gameState);
      });

      client.subscribe('/topic/players', (message) => {
        const updatedPlayers = JSON.parse(message.body);
        setPlayers(Array.isArray(updatedPlayers) ? updatedPlayers : []);
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [player]);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await axios.post(`${config.BASE_URL}/api/games/state?gameId=1`, { players: players });
        console.log('Received game state from backend:', response.data);
        setGameState(response.data.matrix ? response.data.matrix : []);
        logGameStateMatrix(response.data.matrix);
      } catch (error) {
        console.error('Error fetching game state:', error);
      }
    };

    fetchGameState();
  }, [players]);

  const logGameStateMatrix = (gameStateMatrix) => {
    if (!Array.isArray(gameStateMatrix)) {
      console.error('Invalid game state matrix:', gameStateMatrix);
      return;
    }
    let gameStateStr = '';
    for (let row of gameStateMatrix) {
      gameStateStr += row.join(' ') + '\n';
    }
    console.log('Game state matrix:\n' + gameStateStr);
  };

  const handleKeyDown = (event) => {
    if (gameState.length === 0) return; // Salir si gameState aún no está disponible
    let { top, left } = player;
    let newTop = top;
    let newLeft = left;
    let newDirection = playerDirection;
  
    switch (event.key) {
      case 'ArrowUp':
        newTop -= 10;
        newDirection = 'up';
        break;
      case 'ArrowDown':
        newTop += 10;
        newDirection = 'down';
        break;
      case 'ArrowLeft':
        newLeft -= 10;
        newDirection = 'left';
        break;
      case 'ArrowRight':
        newLeft += 10;
        newDirection = 'right';
        break;
      default:
        return; // Ignorar otras teclas
    }
  
    setPlayerDirection(newDirection);
  
    // Comprobar que la nueva posición está dentro de los límites de la matriz y no colisiona con obstáculos
    if (
      newLeft >= 0 && newLeft < 800 && // Límites de la matriz en el eje X (ajustar según sea necesario)
      newTop >= 0 && newTop < 600 && // Límites de la matriz en el eje Y (ajustar según sea necesario)
      gameState[Math.floor(newTop)][Math.floor(newLeft)] !== 4
    ) {
      animateMovement(newTop, newLeft);
    }
  };
  
  const animateMovement = (newTop, newLeft) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  
    const animate = () => {
      setPlayers(prevPlayers => {
        if (!Array.isArray(prevPlayers)) return [];
        return prevPlayers.map(p => {
          if (p.id !== player.id) return p;
  
          const distanceX = newLeft - p.left;
          const distanceY = newTop - p.top;
  
          if (Math.abs(distanceX) <= 1 && Math.abs(distanceY) <= 1) {
            return { ...p, top: newTop, left: newLeft };
          }
  
          const moveX = distanceX !== 0 ? distanceX / Math.abs(distanceX) : 0;
          const moveY = distanceY !== 0 ? distanceY / Math.abs(distanceY) : 0;
  
          return { ...p, top: p.top + moveY, left: p.left + moveX };
        });
      });
  
      animationRef.current = requestAnimationFrame(animate);
    };
  
    animate();
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [player, playerDirection, gameState]);
  

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player, playerDirection, gameState]);

  if (gameState.length === 0) {
    return <div>Loading game state...</div>;
  }

  if (gameOver) {
    return <GameOver score={score} howWin={howWin} />;
  }

  return (
    <>
      <GameInfo score={score} thiefLives={thiefLives} />
      <div className="game-container">
        {gameState.map((row, y) =>
          row.map((cell, x) => {
            switch (cell) {
              case 1:
                return <Player key={`player-${x}-${y}`} x={x} y={y} direction={playerDirection} paso1={true} type="police" />;
              case 2:
                return <Player key={`player-${x}-${y}`} x={x} y={y} direction={playerDirection} paso1={true} type="thief" />;
              case 3:
                return <Diamond key={`diamond-${x}-${y}`} x={x} y={y} />;
              case 4:
                return <Obstacle key={`obstacle-${x}-${y}`} x={x} y={y} />;
              case 5:
                return <BaseThief key={`baseThief-${x}-${y}`} x={x} y={y} />;
              case 6:
                return <BasePolice key={`basePolice-${x}-${y}`} x={x} y={y} />;
              default:
                return null;
            }
          })
        )}
      </div>
    </>
  );
};

export default Game;
