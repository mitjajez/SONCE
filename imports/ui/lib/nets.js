import { getLastPointFromPathD } from '../svg.js';

export const newNetPathPoint = (d, T) => { // ['a-x', 'a-l', 'l', 'l-a', 'a-y']
  const p = d ? getLastPointFromPathD(d) : {x:0, y:0};

  let str = '';
  let dl = 0;
  switch (this.state.get('wiringMode')) {
  case 'axis-x':
    str = ` H${T.x} V${T.y}`;
    break;
  case 'axis-line':
    if( Math.abs(T.x-p.x) > Math.abs(T.y-p.y) ) {
      dl = Math.abs(T.y-p.y);
      str = T.x > p.x ? ` H${T.x-dl}` : ` H${T.x+dl}`;
      str += T.x > p.x ? ` l${dl}` : ` l${-dl}`;
      str += T.y > p.y ? `,${dl}` : `,${-dl}`;
    }
    else {
      dl = Math.abs(T.x-p.x);
      str = T.y > p.y ? ` V${T.y-dl}` : ` V${T.y+dl}`;
      str += T.x > p.x ? ` l${dl}` : ` l${-dl}`;
      str += T.y > p.y ? `,${dl}` : `,${-dl}`;
    }
    break;
  case 'line':
    str = ` L${T.x},${T.y}`;
    break;
  case 'line-axis':
    if(Math.abs(T.x-p.x) > Math.abs(T.y-p.y)){ // LH ...
      dl = Math.abs(T.y-p.y);
      str = T.x > p.x ? ` l${dl}` : ` l${-dl}`;
      str += T.y > p.y ? `,${dl}` : `,${-dl}`;
      str += ` H${T.x}`;
    }
    else { // LV
      dl = Math.abs(T.x-p.x);
      str = T.x > p.x ? ` l${dl}` : ` l${-dl}`;
      str += T.y > p.y ? `,${dl}` : `,${-dl}`;
      str += ` V${T.y}`;
    }
    break;
  case 'axis-y':
    str = ` V${T.y} H${T.x}`;
    break;
  default:
  }
  return str;
};
