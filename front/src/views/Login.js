import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext';

const thiefPositions = [
    { top: 5, left: 5 },
    { top: 10, left: 5 },
    { top: 15, left: 5 },
    { top: 20, left: 5 }
];

const policePositions = [
    { top: 5, left: 10 },
    { top: 10, left: 10 },
    { top: 15, left: 10 },
    { top: 20, left: 10 }
];

const Login = () => {
    const [name, setName] = useState('');
    const [isThief, setIsThief] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setSocket } = useWebSocket();

    const handlePlay = () => {
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        const id = Math.floor(Math.random() * 8) + 1; // Assign an ID between 1 and 8
        const position = isThief ? thiefPositions[id % thiefPositions.length] : policePositions[id % policePositions.length];

        const playerData = {
            id: id,
            name: name.trim(),
            top: position.top,
            left: position.left,
            isThief: isThief
        };

        const socket = new WebSocket('ws://localhost:8080/lobby');
        socket.onopen = () => {
            console.log('WebSocket connection established');
            socket.send(JSON.stringify({ type: 'JOIN', ...playerData }));
        };

        setSocket(socket);
        navigate('/lobby', { state: { playerData: playerData } });
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <label>
                    <input
                        type="radio"
                        value="thief"
                        checked={isThief}
                        onChange={() => setIsThief(true)}
                    />
                    Thief
                </label>
                <label>
                    <input
                        type="radio"
                        value="police"
                        checked={!isThief}
                        onChange={() => setIsThief(false)}
                    />
                    Police
                </label>
            </div>
            <div>
                <button onClick={handlePlay}>Play</button>
            </div>
        </div>
    );
};

export default Login;
