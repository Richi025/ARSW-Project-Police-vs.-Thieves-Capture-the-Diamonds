import React from 'react';

// Imágenes del policía
import policeDown from '../images/police/down.png';
import policeLeft from '../images/police/left.png';
import policeRight from '../images/police/right.png';
import policeUp from '../images/police/up.png';

import policeRight2 from '../images/police/right2.png';
import policeDown2 from '../images/police/down2.png';
import policeLeft2 from '../images/police/left2.png';
import policeUp2 from '../images/police/up2.png';

import policeStayRight from '../images/police/stayRight.png';
import policeStayDown from '../images/police/stayDown.png';
import policeStayLeft from '../images/police/stayLeft.png';
import policeStayUp from '../images/police/stayUp.png';

import policeStayRight2 from '../images/police/stayRight2.png';
import policeStayDown2 from '../images/police/stayDown2.png';
import policeStayLeft2 from '../images/police/stayLeft2.png';
import policeStayUp2 from '../images/police/stayUp2.png';

// Imágenes del ladrón
import thiefDown from '../images/thief/down.png';
import thiefLeft from '../images/thief/left.png';
import thiefRight from '../images/thief/right.png';
import thiefUp from '../images/thief/up.png';

import thiefRight2 from '../images/thief/right2.png';
import thiefDown2 from '../images/thief/down2.png';
import thiefLeft2 from '../images/thief/left2.png';
import thiefUp2 from '../images/thief/up2.png';

import thiefStayRight from '../images/thief/stayRight.png';
import thiefStayDown from '../images/thief/stayDown.png';
import thiefStayLeft from '../images/thief/stayLeft.png';
import thiefStayUp from '../images/thief/stayUp.png';

import thiefStayRight2 from '../images/thief/stayRight2.png';
import thiefStayDown2 from '../images/thief/stayDown2.png';
import thiefStayLeft2 from '../images/thief/stayLeft2.png';
import thiefStayUp2 from '../images/thief/stayUp2.png';

function Player({ top, left, direction, paso1, type }) {
  const policeImages1 = {
    down: policeDown,
    left: policeLeft,
    right: policeRight,
    up: policeUp,
    stayRight: policeStayRight,
    stayLeft: policeStayLeft,
    stayUp: policeStayUp,
    stayDown: policeStayDown,
  };

  const policeImages2 = {
    down: policeDown2,
    left: policeLeft2,
    right: policeRight2,
    up: policeUp2,
    stayRight: policeStayRight2,
    stayLeft: policeStayLeft2,
    stayUp: policeStayUp2,
    stayDown: policeStayDown2,
  };

  const thiefImages1 = {
    down: thiefDown,
    left: thiefLeft,
    right: thiefRight,
    up: thiefUp,
    stayRight: thiefStayRight,
    stayLeft: thiefStayLeft,
    stayUp: thiefStayUp,
    stayDown: thiefStayDown,
  };

  const thiefImages2 = {
    down: thiefDown2,
    left: thiefLeft2,
    right: thiefRight2,
    up: thiefUp2,
    stayRight: thiefStayRight2,
    stayLeft: thiefStayLeft2,
    stayUp: thiefStayUp2,
    stayDown: thiefStayDown2,
  };

  const playerImages1 = type === 'police' ? policeImages1 : thiefImages1;
  const playerImages2 = type === 'police' ? policeImages2 : thiefImages2;
  const imagenesAusar = paso1 ? playerImages1 : playerImages2;

  return (
    <img
      src={imagenesAusar[direction]}
      alt={`${type}`}
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: '30px',
        height: '30px',
        zIndex: 3,
      }}
    />
  );
}

export default Player;
