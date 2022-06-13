let batchSize = 20000;
let collection = db.history;
let games = db.game4
  .find({ 'p.ed': { $exists: true } }, { 'p.elo': true, 'p.ed': true, 'p.uid': true, ca: true })
  .sort({ ca: 1 });
let dat = new Date().getTime() / 1000,
  it = 0;

print('Counting games...');
let max = games.count();
print('Migrating ' + max + ' games to user histories');

collection.drop();

function flush(cache) {
  for (uid in cache) {
    collection.update({ _id: uid }, { $pushAll: { entries: cache[uid] } }, { upsert: true });
  }
}

let cache = {};
games.forEach(function (game) {
  for (pi in game.p) {
    try {
      let p = game.p[pi],
        op = game.p[1 - pi];
      let entry = [parseInt(game.ca.getTime() / 1000), parseInt(p.elo + p.ed), parseInt(op.elo)];
      if (typeof cache[p.uid] == 'undefined') cache[p.uid] = [entry];
      else cache[p.uid].push(entry);
    } catch (e) {
      print('game ' + game._id + ' => ' + e);
    }
  }
  ++it;
  if (it % batchSize == 0) {
    if (it % (batchSize * 7) == 0) {
      print('FLUSH');
      flush(cache);
      cache = {};
    }
    let percent = Math.round((it / max) * 100);
    let dat2 = new Date().getTime() / 1000;
    let perSec = Math.round(batchSize / (dat2 - dat));
    dat = dat2;
    print(it / 1000 + 'k ' + percent + '% ' + perSec + '/s');
  }
});
print('FLUSH');
flush(cache);
