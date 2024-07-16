import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

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
  const { initialMatrix, currentPlayer, players: initialPlayers } = location.state || {};
  const [matrix, setMatrix] = useState(initialMatrix);
  const [player, setPlayer] = useState(currentPlayer);
  const [players, setPlayers] = useState(initialPlayers);
  const wsChannelRef = useRef(null);

  class WSChannel {
    constructor(URL, callback) {
      this.URL = URL;
      this.wsocket = new WebSocket(URL);
      this.wsocket.onopen = (evt) => this.onOpen(evt);
      this.wsocket.onmessage = (evt) => this.onMessage(evt);
      this.wsocket.onerror = (evt) => this.onError(evt);
      this.wsocket.onclose = (evt) => this.onClose(evt);
      this.receivef = callback;
      this.pingInterval = null;
    }
    onOpen(evt) {
      console.log("WebSocket connection established:", evt);
      this.startPing();
    }
    onMessage(evt) {
      console.log("Message received from server:", evt.data);
      this.receivef(evt.data);
    }
    onError(evt) {
      console.error("WebSocket error:", evt);
      this.reconnect();
    }
    onClose(evt) {
      console.log("WebSocket connection closed:", evt);
      this.reconnect();
    }
    send(data) {
      console.log("sending:", data);
      this.wsocket.send(data);
    }
    close() {
      this.stopPing();
      this.wsocket.close();
    }
    reconnect() {
      this.stopPing();
      console.log("Reconnecting WebSocket...");
      setTimeout(() => {
        this.wsocket = new WebSocket(this.URL);
        this.wsocket.onopen = (evt) => this.onOpen(evt);
        this.wsocket.onmessage = (evt) => this.onMessage(evt);
        this.wsocket.onerror = (evt) => this.onError(evt);
        this.wsocket.onclose = (evt) => this.onClose(evt);
      }, 1000);
    }
    startPing() {
      if (this.pingInterval) return;
      this.pingInterval = setInterval(() => {
        if (this.wsocket.readyState === WebSocket.OPEN) {
          this.wsocket.send(JSON.stringify({ type: 'PING' }));
        }
      }, 30000);
    }
    stopPing() {
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
    }
  }

  useEffect(() => {
    const handleWSMessage = (msg) => {
      const data = JSON.parse(msg);
      console.log("Received WebSocket message:", data);
      if (data.type === 'UPDATE_GAME_STATE') {
        console.log("Updating game state with data:", data);
        setMatrix(data.matrix);
        setPlayers(data.players || []); // Asegurarnos de que players nunca sea undefined
      }
    };
  
    wsChannelRef.current = new WSChannel('ws://localhost:8080/lobby', handleWSMessage);
  
    return () => {
      if (wsChannelRef.current) {
        wsChannelRef.current.close();
      }
    };
  }, []);
  

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

    wsChannelRef.current.send(JSON.stringify({
      type: 'PLAYER_MOVE',
      id: newPlayer.id,
      previousTop: previousPosition.top,
      previousLeft: previousPosition.left,
      top: newPlayer.top,
      left: newPlayer.left,
      direction: newPlayer.direction,
    }));

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
      console.log("Matrix or players is invalid");
      console.log("Players:", players);
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
              const player = players.find(p => p.id === value);
              if (player) {
                components.push(
                  <Player
                    key={`player-${x}-${y}`}
                    x={posX}
                    y={posY}
                    direction={player.direction}
                    paso1={true}
                    type={player.isThief ? 'thief' : 'police'}
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
