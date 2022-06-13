function lichessReplayMusic() {
  let orchestra;

  lichess.loadScript('javascripts/music/orchestra.js').then(function () {
    orchestra = lichessOrchestra();
  });

  let isPawn = function (san) {
    return san[0] === san[0].toLowerCase();
  };
  let isKing = function (san) {
    return san[0] === 'K';
  };

  let hasCastle = function (san) {
    return san.startsWith('O-O');
  };
  let hasCheck = function (san) {
    return san.includes('+');
  };
  let hasMate = function (san) {
    return san.includes('#');
  };
  let hasCapture = function (san) {
    return san.includes('x');
  };

  // a -> 0
  // c -> 2
  let fileToInt = function (file) {
    return 'abcdefgh'.indexOf(file);
  };

  // c7 = 2 * 8 + 7 = 23
  let keyToInt = function (key) {
    return fileToInt(key[0]) * 8 + parseInt(key[1]) - 1;
  };

  let uciBase = 64;

  let keyToPitch = function (key) {
    return keyToInt(key) / (uciBase / 23);
  };

  let jump = function (node) {
    if (node.san) {
      let pitch = keyToPitch(node.uci.slice(2));
      let instrument = isPawn(node.san) || isKing(node.san) ? 'clav' : 'celesta';
      orchestra.play(instrument, pitch);
      if (hasCastle(node.san)) orchestra.play('swells', pitch);
      else if (hasCheck(node.san)) orchestra.play('swells', pitch);
      else if (hasCapture(node.san)) {
        orchestra.play('swells', pitch);
        let capturePitch = keyToPitch(node.uci.slice(0, 2));
        orchestra.play(instrument, capturePitch);
      } else if (hasMate(node.san)) orchestra.play('swells', pitch);
    } else {
      orchestra.play('swells', 0);
    }
  };

  return {
    jump: function (node) {
      if (!orchestra) return;
      jump(node);
    },
  };
}
