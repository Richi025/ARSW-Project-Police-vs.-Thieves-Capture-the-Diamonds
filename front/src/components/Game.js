import React, { useState, useEffect } from 'react';
import Player from './Player';
import Diamond from './Diamond';
import BaseThief from './BaseThief';
import BasePolice from './BasePolice';
import diamondsConfig from '../config/diamondsConfig';
import obstaclesConfig from '../config/obstaclesConfig';
import GameInfo from '../componetsStile/GameInfo';
import GameOver from '../componetsStile/GameOver';

function Game() {
  const [playerPosition, setPlayerPosition] = useState({ top: 500, left: 50 });
  const [thiefPosition, setThiefPosition] = useState({ top: 200, left: 50 });
  const [playerDirection, setPlayerDirection] = useState("stayRight");
  const [paso1, setPaso1] = useState(true);
  const [thiefLives, setThiefLives] = useState(3);
  const playerType = "police";
  const [diamonds, setDiamonds] = useState(diamondsConfig);
  const [gameOver, setGameOver] = useState(false);
  const [howWin, setHowWin] = useState("police");
  const obstacles = obstaclesConfig;

  const basesThief = [
    { id: 1, top: 0, left: 0, width: 100, height: 200 }, // Actualizado con width y height
  ];

  const basesPolice = [
    { id: 1, top: 400, left: 700, width: 100, height: 200 }, // Actualizado con width y height
  ];

  const [score, setScore] = useState(0);

  const isCollidingWithObstacle = (newPosition) => {
    return obstacles.some(obstacle => {
      return (
        newPosition.top < obstacle.top + 50 &&
        newPosition.top > obstacle.top - 30 &&
        newPosition.left < obstacle.left + 50 &&
        newPosition.left > obstacle.left - 30
      );
    });
  };

  const collectDiamond = (newPosition) => {
    if (playerType === "police") {
      return; // Si es policía, no recolecta diamantes
    }
    const collectedDiamond = diamonds.find(diamond => {
      return (
        newPosition.top < diamond.top + 30 &&
        newPosition.top > diamond.top - 30 &&
        newPosition.left < diamond.left + 30 &&
        newPosition.left > diamond.left - 30
      );
    });

    if (collectedDiamond) {
      setDiamonds(diamonds.filter(diamond => diamond.id !== collectedDiamond.id));
      setScore(score + 100);
    }

    // Verificar condición de victoria de los ladrones
    if (playerType === "thief" && diamonds.length === 0) {
      setGameOver(true);
      setHowWin("thief")
    }
  };

  const isInBase = (newPosition, base) => {
    return (
      newPosition.top < base.top + base.height && 
      newPosition.top > base.top - 30 &&
      newPosition.left < base.left + base.width  && 
      newPosition.left > base.left - 30
    );
  };
  
  const handleKeyDown = (e) => {
    let { top, left } = playerPosition;
    const newPosition = { ...playerPosition };

    switch (e.key) {
      case 'ArrowUp':
        newPosition.top = Math.max(top - 10, 0);
        setPlayerDirection('up');
        setPaso1(!paso1);
        setTimeout(() => {
          setPlayerDirection('stayUp');
        }, 300);
        break;
      case 'ArrowDown':
        newPosition.top = Math.min(top + 10, 570);
        setPlayerDirection('down');
        setPaso1(!paso1);
        setTimeout(() => {
          setPlayerDirection('stayDown');
        }, 300);
        break;
      case 'ArrowLeft':
        newPosition.left = Math.max(left - 10, 0);
        setPlayerDirection('left');
        setPaso1(!paso1);
        setTimeout(() => {
          setPlayerDirection('stayLeft');
        }, 300);
        break;
      case 'ArrowRight':
        newPosition.left = Math.min(left + 10, 770);
        setPlayerDirection('right');
        setPaso1(!paso1);
        setTimeout(() => {
          setPlayerDirection('stayRight');
        }, 300);
        break;
      case ' ':
        // Captura de ladrón
        if (playerType === "police" && Math.abs(newPosition.top - thiefPosition.top) < 30 && Math.abs(newPosition.left - thiefPosition.left) < 30) {
          setThiefLives(thiefLives - 1);

          setThiefPosition({ top: 300, left: 50 }); // Posición inicial del ladrón
          if(thiefLives === 1){
            setGameOver(true);
            setHowWin("police");
          }
        }
        break;
      default:
        break;
    }

    if (
      !isCollidingWithObstacle(newPosition) &&
      !(playerType === 'police' && basesThief.some(base => isInBase(newPosition, base))) &&
      !(playerType === 'thief' && basesPolice.some(base => isInBase(newPosition, base)))
    ) {
      setPlayerPosition(newPosition);
      collectDiamond(newPosition);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPosition, thiefPosition, diamonds, score, thiefLives]);

  if (gameOver) {
    return <GameOver score={score} win={howWin}/>;
  }

  return (
    <>
    <GameInfo score={score} thiefLives={thiefLives} />
    <div className="game-container">
      <Player top={playerPosition.top} left={playerPosition.left} direction={playerDirection} paso1={paso1} type={playerType} />
      <Player top={thiefPosition.top} left={thiefPosition.left} direction={"stayRight"} paso1={paso1} type="thief" />
      {diamonds.map(diamond => (
        <Diamond key={diamond.id} top={diamond.top} left={diamond.left} />
      ))}
      {obstacles.map(obstacle => (
        <div key={obstacle.id} className="obstacle" style={{ top: obstacle.top, left: obstacle.left }} />
      ))}
      {basesThief.map(baseThief => (
        <BaseThief key={baseThief.id} top={baseThief.top} left={baseThief.left} />
      ))}
      {basesPolice.map(basePolice => (
        <BasePolice key={basePolice.id} top={basePolice.top} left={basePolice.left} />
      ))}
      
      
    </div>
    
      
    </>
  );
}

export default Game;
