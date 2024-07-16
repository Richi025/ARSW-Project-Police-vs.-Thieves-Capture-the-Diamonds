import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledLobbyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #282c34;
  color: white;
`;

const StyledLobby = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const StyledTh = styled.th`
  border: 1px solid white;
  padding: 10px;
`;

const StyledTd = styled.td`
  border: 1px solid white;
  padding: 10px;
  text-align: center;
`;

const Lobby = () => {
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);
  const currentPlayer = location.state?.playerData;

  useEffect(() => {
    if (!currentPlayer) {
      navigate('/');
      return;
    }

    const connectWebSocket = () => {
      if (socketRef.current) {
        return;  // Ya existe una conexión WebSocket, no crear una nueva
      }

      const socket = new WebSocket('ws://localhost:8080/lobby');
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connection established');
        socket.send(JSON.stringify({ type: 'JOIN', ...currentPlayer }));
      };

      socket.onmessage = (event) => {
        console.log('Message received from server:', event.data);
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_PLAYERS') {
          console.log('Updated players:', data.players);
          if (data.players && data.players.length > 0) {
            setPlayers(data.players);
          } else {
            console.warn('No player information received');
            setPlayers([]);  // Clear the players state if no players are received
          }
        } else if (data.type === 'START_GAME') {
          console.log('Received START_GAME message');
          console.log('Received START_GAME message');
          console.log('Initial Matrix:', data.matrix);
          console.log('Players:', data.players);
          navigate('/game', { state: { initialMatrix: data.matrix, currentPlayer: currentPlayer, players: data.players} });
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        if (!event.wasClean) {
          console.error('WebSocket error:', event);
          setTimeout(connectWebSocket, 1000);  // Retry connection after 1 second
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
      };

      return () => {
        console.log('Closing WebSocket connection');
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    };

    connectWebSocket();
  }, [navigate, currentPlayer]);

  const handleReady = () => {
    setIsReady(true);
    if (socketRef.current) {
      console.log('Sending PLAYER_READY message');
      socketRef.current.send(JSON.stringify({ type: 'PLAYER_READY' }));
    }
  };

  return (
    <StyledLobbyWrapper>
      <StyledLobby>
        <h1>Lobby</h1>
        <StyledTable>
          <thead>
            <tr>
              <StyledTh>ID</StyledTh>
              <StyledTh>Name</StyledTh>
              <StyledTh>Top</StyledTh>
              <StyledTh>Left</StyledTh>
              <StyledTh>Type</StyledTh>
              <StyledTh>Status</StyledTh>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((player, index) => (
                <tr key={index}>
                  <StyledTd>{player.id}</StyledTd>
                  <StyledTd>{player.name}</StyledTd>
                  <StyledTd>{player.top}</StyledTd>
                  <StyledTd>{player.left}</StyledTd>
                  <StyledTd>{player.isThief ? 'Thief' : 'Police'}</StyledTd>
                  <StyledTd>{player.isReady ? '✔️ Ready' : '❌ Not Ready'}</StyledTd>
                </tr>
              ))
            ) : (
              <tr>
                <StyledTd colSpan="6">No players available</StyledTd>
              </tr>
            )}
          </tbody>
        </StyledTable>
        <button onClick={handleReady} disabled={isReady}>Ready</button>
      </StyledLobby>
    </StyledLobbyWrapper>
  );
};

export default Lobby;
