import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext';
import BasePolice from '../components/BasePolice';
import BaseThief from '../components/BaseThief';
import Diamond from '../components/Diamond';
import Obstacle from '../components/Obstacle';
import Player from '../components/Player';
import './Game.css'; // Importamos un archivo CSS para los estilos adicionales

const Game = () => {
  const location = useLocation();
  const { initialMatrix, currentPlayer, players: initialPlayers } = location.state;
  const { socket } = useWebSocket();

  const [player, setPlayer] = useState(currentPlayer);
  const [matrix, setMatrix] = useState(initialMatrix);
  const [players, setPlayers] = useState(initialPlayers);

  useEffect(() => {
    const handleWSMessage = (msg) => {
      const data = JSON.parse(msg);
      if (data.type === 'UPDATE_GAME_STATE') {
        setMatrix(data.matrix);
        setPlayers(data.players);
      }
    };

    if (socket) {
      socket.onmessage = (event) => handleWSMessage(event.data);
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);

  const CELL_SIZE = 20;

  const isCollidingWithObstacle = (newTop, newLeft) => {
    const obstacleSize = 50; // Tamaño del obstáculo (ajustar según tu configuración)
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === 10) { // Código para los obstáculos
          const obstacleTop = y * CELL_SIZE;
          const obstacleLeft = x * CELL_SIZE;
          if (
            newTop < obstacleTop + obstacleSize - 10 &&
            newTop > obstacleTop - 20 &&
            newLeft < obstacleLeft + obstacleSize - 10 &&
            newLeft > obstacleLeft - 20
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    let newTop = player.top;
    let newLeft = player.left;
    let direction = player.direction;

    switch (key) {
      case 'ArrowUp':
        newTop = Math.max(player.top - 1, 0);
        direction = 'up';
        break;
      case 'ArrowDown':
        newTop = Math.min(player.top + 1, matrix.length - 1);
        direction = 'down';
        break;
      case 'ArrowLeft':
        newLeft = Math.max(player.left - 1, 0);
        direction = 'left';
        break;
      case 'ArrowRight':
        newLeft = Math.min(player.left + 1, matrix[0].length - 1);
        direction = 'right';
        break;
      default:
        return;
    }

    if (isCollidingWithObstacle(newTop * CELL_SIZE, newLeft * CELL_SIZE)) {
      return; // No permitir movimiento si colisiona con un obstáculo
    }

    const previousPosition = { top: player.top, left: player.left };
    const newPlayer = { ...player, top: newTop, left: newLeft, direction, paso1: !player.paso1 };
    setPlayer(newPlayer);

    if (socket) {
      socket.send(JSON.stringify({
        type: 'PLAYER_MOVE',
        id: newPlayer.id,
        previousTop: previousPosition.top,
        previousLeft: previousPosition.left,
        top: newPlayer.top,
        left: newPlayer.left,
        direction: newPlayer.direction,
        paso1: newPlayer.paso1 // Enviar nuevo atributo
      }));
    }

    setTimeout(() => {
      setPlayer(prevPlayer => ({
        ...prevPlayer,
        direction: `stay${direction.charAt(0).toUpperCase() + direction.slice(1)}`,
      }));
    }, 300);

    event.preventDefault();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player]);

  const renderMatrix = () => {
    if (!matrix || !Array.isArray(players)) {
      return null;
    }

    const components = [];
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const value = matrix[y][x];
        const posX = x * CELL_SIZE;
        const posY = y * CELL_SIZE;
        switch (value) {
          case 9:
            components.push(<Diamond key={`diamond-${x}-${y}`} x={posX} y={posY} />);
            break;
          case 10:
            components.push(<Obstacle key={`obstacle-${x}-${y}`} x={posX} y={posY} />);
            break;
          case 11:
            components.push(<BaseThief key={`baseThief-${x}-${y}`} x={posX} y={posY} />);
            break;
          case 12:
            components.push(<BasePolice key={`basePolice-${x}-${y}`} x={posX} y={posY} />);
            break;
          default:
            if (value >= 1 && value <= 8) {
              const currentPlayer = players.find(p => p.id === value);
              if (currentPlayer) {
                components.push(
                  <Player
                    key={`player-${x}-${y}`}
                    x={posX}
                    y={posY}
                    direction={currentPlayer.direction}
                    paso1={currentPlayer.paso1}
                    type={currentPlayer.isThief ? 'thief' : 'police'}
                  />
                );
              }
            }
            break;
        }
      }
    }
    return components;
  };

  return (
    <div className="game-container">
      <div className="scoreboard">
        <h2>Scoreboard</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index}><td>{player.id}</td><td>{player.name}</td><td>{player.score || 0}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="game-wrapper">
        <div className="game-board">
          {renderMatrix()}
        </div>
      </div>
      <div className="controls">
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </div>
      <p>Current Player: {JSON.stringify(player, null, 2)}</p>
    </div>
  );
};

export default Game;
