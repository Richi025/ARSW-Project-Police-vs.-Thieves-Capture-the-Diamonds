import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext';
import './Lobby.css'; // Importamos un archivo CSS para los estilos adicionales

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
    <div className="lobby-wrapper">
      <div className="lobby">
        <h1>Lobby</h1>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Top</th>
              <th>Left</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((player, index) => (
                <tr key={index}>
                  <td>{player.id}</td>
                  <td>{player.name}</td>
                  <td>{player.top}</td>
                  <td>{player.left}</td>
                  <td>{player.isThief ? 'Thief' : 'Police'}</td>
                  <td>{player.isReady ? '✔️ Ready' : '❌ Not Ready'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No players available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="button-container">
          <button onClick={handleReady} disabled={isReady} className="ready-button">Ready</button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
