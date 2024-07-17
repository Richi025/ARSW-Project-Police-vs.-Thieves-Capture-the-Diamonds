import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useWebSocket } from '../WebSocketContext';
import BasePolice from '../components/BasePolice';
import BaseThief from '../components/BaseThief';
import Diamond from '../components/Diamond';
import Obstacle from '../components/Obstacle';
import Player from '../components/Player';

const StyledGameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: black;
  color: white;
`;

const StyledGameBoard = styled.div`
  position: relative;
  width: 800px;
  height: 800px;
  background-color: green;
`;

const Game = () => {
  const location = useLocation();
  const { initialMatrix, currentPlayer, players: initialPlayers } = location.state;
  const { socket } = useWebSocket();

  const [player, setPlayer] = useState(currentPlayer);
  const [paso1, setPaso1] = useState(true);
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

    const previousPosition = { top: player.top, left: player.left };
    const newPlayer = { ...player, top: newTop, left: newLeft, direction };
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
      }));
    }

    setPaso1(!paso1);
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
                    paso1={paso1}
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
    <StyledGameWrapper>
      <div>
        <h1>Game</h1>
        <StyledGameBoard>
          {renderMatrix()}
        </StyledGameBoard>
        <p>Current Player: {JSON.stringify(player, null, 2)}</p>
      </div>
    </StyledGameWrapper>
  );
};

export default Game;
