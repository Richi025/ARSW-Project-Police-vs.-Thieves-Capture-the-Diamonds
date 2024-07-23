import React from 'react';
import Player from './Player';

const PlayerWithLabel = ({ x, y, direction, paso1, type, name }) => {
  return (
    <div style={{ position: 'absolute', top: `${y}px`, left: `${x}px`, textAlign: 'center', zIndex: 3 }}>
      <div style={{ marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: 'white', textShadow: '1px 1px 2px black' }}>
        {name}
      </div>
      <Player x={0} y={0} direction={direction} paso1={paso1} type={type} />
    </div>
  );
};

export default PlayerWithLabel;
