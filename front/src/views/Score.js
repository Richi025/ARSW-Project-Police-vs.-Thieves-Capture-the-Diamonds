// src/components/Scores.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Score.css';

const Scores = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('/players/top5')
      .then(response => {
        setPlayers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the scores!", error);
      });
  }, []);

  return (
    <div className="scores-container">
      <h1>Top 5 Players</h1>
      <table className="scores-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scores;
