let puzzles = db.puzzle;

function fullMoveNumber(p) {
  return Math.floor(1 + (p.history.split(' ').length - 1) / 2);
}

function changeFenMoveNumber(fen, n) {
  parts = fen.split(' ');
  parts[parts.length - 1] = n;
  return parts.join(' ');
}

puzzles
  .find({
    _id: {
      $lt: 60121,
    },
  })
  .forEach(function (p) {
    let newMoveNumber = fullMoveNumber(p);
    let newFen = changeFenMoveNumber(p.fen, newMoveNumber);
    puzzles.update(
      {
        _id: p._id,
      },
      {
        $set: {
          fen: newFen,
        },
      }
    );
  });
