import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useWebSocket } from '../WebSocketContext';

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
  const { playerData } = location.state;
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!playerData || !socket) {
      navigate('/');
      return;
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'UPDATE_PLAYERS') {
        setPlayers(data.players);
      } else if (data.type === 'START_GAME') {
        navigate('/game', { state: { initialMatrix: data.matrix, currentPlayer: playerData, players: data.players } });
      }
    };

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [navigate, playerData, socket]);

  const handleReady = () => {
    setIsReady(true);
    if (socket) {
      socket.send(JSON.stringify({ type: 'PLAYER_READY' }));
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
