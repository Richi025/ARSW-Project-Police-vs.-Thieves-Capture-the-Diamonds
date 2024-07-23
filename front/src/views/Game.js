import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext';
import BasePolice from '../components/BasePolice';
import BaseThief from '../components/BaseThief';
import Diamond from '../components/Diamond';
import Obstacle from '../components/Obstacle';
import PlayerWithLabel from '../components/PlayerWithLabel'; // Importar el nuevo componente
import './Game.css'; // Importamos un archivo CSS para los estilos adicionales
import { RESThostURL, WShostURL } from './URLFunctions'; // Importa las funciones

const Game = () => {
  const location = useLocation();
  const { initialMatrix, currentPlayer, players: initialPlayers } = location.state;
  const { socket } = useWebSocket();
  const [player, setPlayer] = useState(currentPlayer);
  const [matrix, setMatrix] = useState(initialMatrix);
  const [players, setPlayers] = useState(initialPlayers);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos en segundos
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [showGameOver, setShowGameOver] = useState(false);
  const [topPlayers, setTopPlayers] = useState([]);
  const [showTopPlayers, setShowTopPlayers] = useState(false);

  useEffect(() => {
    const handleWSMessage = (msg) => {
      const data = JSON.parse(msg);
      if (data.type === 'UPDATE_GAME_STATE') {
        setMatrix(data.matrix);
        setPlayers(data.players);
      } else if (data.type === 'INITIAL_POSITION') {
        handleInitialPositionUpdate(data);
      } else if (data.type === 'TIMER_UPDATE') {
        setTimeLeft(data.timeLeft);
      } else if (data.type === 'GAME_OVER') {
        setGameOver(true);
        setWinner(data.winner);
        setShowGameOver(true);
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

  const handleInitialPositionUpdate = (data) => {
    const updatedPlayers = players.map(p => {
      if (p.id === data.id) {
        return { ...p, top: data.top, left: data.left };
      }
      return p;
    });
    setPlayers(updatedPlayers);
    if (player.id === data.id) {
      setPlayer(prev => ({ ...prev, top: data.top, left: data.left }));
    }
  };

  const CELL_SIZE = 20;

  const isCollidingWithObstacle = (newTop, newLeft) => {
    const obstacleSize = 50;
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === 10) {
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

  const isCollidingWithPlayer = (newTop, newLeft) => {
    for (const otherPlayer of players) {
      if (otherPlayer.id !== player.id && otherPlayer.top === newTop && otherPlayer.left === newLeft) {
        return otherPlayer;
      }
    }
    return null;
  };

  const isCollidingWithDiamond = (newTop, newLeft) => {
    const diamondSize = 20;
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === 9) {
          const diamondTop = y * CELL_SIZE;
          const diamondLeft = x * CELL_SIZE;
          if (
            newTop < diamondTop + diamondSize &&
            newTop > diamondTop - CELL_SIZE &&
            newLeft < diamondLeft + diamondSize &&
            newLeft > diamondLeft - CELL_SIZE
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const isCollidingWithBase = (newTop, newLeft) => {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === 11 && !player.isThief) {
          const baseTop = y * CELL_SIZE;
          const baseLeft = x * CELL_SIZE;
          if (
            newTop < baseTop + CELL_SIZE + 180 &&
            newTop > baseTop - CELL_SIZE - 30 &&
            newLeft < baseLeft + CELL_SIZE + 80 &&
            newLeft > baseLeft - CELL_SIZE - 30
          ) {
            return true;
          }
        }
        if (matrix[y][x] === 11 && player.isThief) {
          const baseTop = y * CELL_SIZE;
          const baseLeft = x * CELL_SIZE;
          if (
            newTop < baseTop + CELL_SIZE &&
            newTop > baseTop - CELL_SIZE &&
            newLeft < baseLeft + CELL_SIZE &&
            newLeft > baseLeft - CELL_SIZE
          ) {
            return true;
          }
        }
        if (matrix[y][x] === 12 && player.isThief) {
          const baseTop = y * CELL_SIZE;
          const baseLeft = x * CELL_SIZE;
          if (
            newTop < baseTop + CELL_SIZE + 200 &&
            newTop > baseTop - CELL_SIZE &&
            newLeft < baseLeft + CELL_SIZE + 100 &&
            newLeft > baseLeft - CELL_SIZE
          ) {
            return true;
          }
        }
        if (matrix[y][x] === 12 && !player.isThief) {
          const baseTop = y * CELL_SIZE;
          const baseLeft = x * CELL_SIZE;
          if (
            newTop < baseTop + CELL_SIZE &&
            newTop > baseTop - CELL_SIZE &&
            newLeft < baseLeft + CELL_SIZE &&
            newLeft > baseLeft - CELL_SIZE
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

    if (gameOver || (player.isThief && player.lives === 0)) {
      return;
    }

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
      case ' ':
        if (!player.isThief) {
          handleCapture();
        }
        return;
      default:
        return;
    }

    if (isCollidingWithObstacle(newTop * CELL_SIZE, newLeft * CELL_SIZE)) {
      return;
    }

    if (isCollidingWithBase(newTop * CELL_SIZE, newLeft * CELL_SIZE)) {
      return;
    }

    if (!player.isThief && isCollidingWithDiamond(newTop * CELL_SIZE, newLeft * CELL_SIZE)) {
      return;
    }

    const collidingPlayer = isCollidingWithPlayer(newTop, newLeft);
    if (collidingPlayer) {
      return;
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
        paso1: newPlayer.paso1
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

  const handleCapture = () => {
    if (socket) {
      const capturedThief = players.find(p => p.isThief && Math.abs(p.top - player.top) <= 1 && Math.abs(p.left - player.left) <= 1);
      if (capturedThief) {
        socket.send(JSON.stringify({
          type: 'CAPTURE_THIEF',
          policeId: player.id,
          thiefId: capturedThief.id
        }));
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player]);

  const fetchTopPlayers = async () => {
    try {
      const response = await fetch(`${RESThostURL()}/players/top`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTopPlayers(data);
      } else {
        setTopPlayers([]);
      }
      setShowTopPlayers(true);
    } catch (error) {
      console.error('Error fetching top players:', error);
    }
  };

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
                  <PlayerWithLabel
                    key={`player-${x}-${y}`}
                    x={posX}
                    y={posY}
                    direction={currentPlayer.direction}
                    paso1={currentPlayer.paso1}
                    type={currentPlayer.isThief ? 'thief' : 'police'}
                    name={currentPlayer.name}
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

  const policePlayers = players.filter(player => !player.isThief);
  const thiefPlayers = players.filter(player => player.isThief);

  const handleGameOverClose = () => {
    setShowGameOver(false);
  };

  return (
    <div className="game-container">
      {showGameOver && (
        <div className="game-over">
          <div className="game-over-content">
            <h2>Game Over</h2>
            <p>Winner: {winner}</p>
            <button onClick={handleGameOverClose}>Close</button>
          </div>
        </div>
      )}
      {showTopPlayers && (
        <div className="top-players">
          <div className="top-players-content">
            <h2>Top Players</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player, index) => (
                  <tr key={index}>
                    <td>{player.name}</td>
                    <td>{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setShowTopPlayers(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="scoreboard">
        <h2>Policías</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {policePlayers.map((player, index) => (
              <tr key={index}><td>{player.id}</td><td>{player.name}</td><td>{player.score || 0}</td></tr>
            ))}
          </tbody>
        </table>

        <h2>Ladrones</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Score</th>
              <th>Lives</th>
            </tr>
          </thead>
          <tbody>
            {thiefPlayers.map((player, index) => (
              <tr key={index}><td>{player.id}</td><td>{player.name}</td><td>{player.score || 0}</td><td>{player.lives}</td></tr>
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
        <button onClick={fetchTopPlayers}>view scores</button>
      </div>
      <p>Time Left: {timeLeft} seconds</p>
    </div>
  );
};

export default Game;
