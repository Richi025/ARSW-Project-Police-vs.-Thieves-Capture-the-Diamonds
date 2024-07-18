import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../WebSocketContext';
import loginImage from '../images/login.jpg';
import './Login.css'; // Importamos un archivo CSS para los estilos adicionales

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

        const id = Math.floor(Math.random() * 8) + 1;
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
        <div className="login-container" style={{
            height: '100vh',
            width: '80vw',
            backgroundImage: `url(${loginImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <div className="login-form" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '20px', borderRadius: '10px' }}>
                <h2>Login</h2>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="name-input" // Añadimos una clase para los estilos del input
                        />
                    </label>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div>
                    <label style={{ marginRight: '10px' }}>
                        <input
                            type="radio"
                            value="thief"
                            checked={isThief}
                            onChange={() => setIsThief(true)}
                            style={{ marginRight: '5px' }}
                        />
                        Thief
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="police"
                            checked={!isThief}
                            onChange={() => setIsThief(false)}
                            style={{ marginRight: '5px' }}
                        />
                        Police
                    </label>
                </div>
                <div className="play-button-container">
                    <button onClick={handlePlay} className="play-button">Play</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
