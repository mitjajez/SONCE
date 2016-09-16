import Snap from 'snapsvg';

export const getCanvasPoint = (T, pan, zoom) => {
  return {
    x: Math.round((T.x - pan.x) / zoom),
    y: Math.round((T.y - pan.y) / zoom),
  };
};

export const getLastPointFromPathD = (d) => {
  const p = {x:0, y:0};
  Snap.parsePathString(d).map((s) => {
    switch (s[0]) {
    case 'M':
      p.x = s[1];
      p.y = s[2];
      break;
    case 'm':
      p.x += s[1];
      p.y += s[2];
      break;
    case 'H':
      p.x = s[1];
      break;
    case 'h':
      p.x += s[1];
      break;
    case 'V':
      p.y = s[1];
      break;
    case 'v':
      p.y += s[1];
      break;
    case 'L':
      p.x = s[1];
      p.y = s[2];
      break;
    case 'l':
      p.x += s[1];
      p.y += s[2];
      break;
    default:
      // console.log(`${s[0]} Not supported!`);
    }
    // console.log( `${i}: ${s} -> (${p.x},${p.y})`);
  });
  return p;
};
