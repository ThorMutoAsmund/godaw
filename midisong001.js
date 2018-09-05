let organ = loadInstr('./organ.ins');
let piano = loadInstr('./piano.ins');
let echo = loadEffect('./slowEcho.efx');

let steps = () => {
  set('scale', 'c-major');
  set('spacing', 50);
  set('velocity', 127);

  set('track', 0);
  add([0, 1, 2, 3, 4, 5, 6], { offset: 0, length: 960 / 8, velocity: 127 });
  [1, 2, 3, 4].forEach(t => {
    add([7, 8, 9, 10, 11, 12, 13], {
      offset: t,
      length: 960 / 8,
      velocity: tick => {
        127 - (127 * tick) / 960;
      }
    });
    add([0, 1, 2, 3, 4, 5, 6], {
      offset: t,
      length: 960 / 8,
      velocity: tick => {
        (127 * tick) / 960;
      }
    });
  });
};

set('ticksperbeat', 960);
set('bpm', 120);
add('track', {});

set('time', 0);
set('instr', organ);
steps();
