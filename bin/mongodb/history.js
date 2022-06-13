let historyToMigrate = db.user_history.find();
let max = historyToMigrate.count();
let batchSize = 1000;
let collection = db.history;
let games = db.game4;
let dat = new Date().getTime() / 1000,
  it = 0;

print('Migrating ' + max + ' user histories');

collection.drop();

let game;
historyToMigrate.forEach(function (h) {
  let h2 = { _id: h._id, entries: [] };
  for (ts in h.entries) {
    let e = h.entries[ts];
    let e2 = [parseInt(ts), parseInt(e.e)];
    if (e.g) {
      game = games.findOne({ _id: e.g }, { 'p.elo': true, 'p.uid': true });
      if (game) {
        if (game.p[0].uid != h._id) e2.push(game.p[0].elo);
        else e2.push(game.p[1].elo);
      }
    }
    h2.entries.push(e2);
  }
  collection.update({ _id: h2._id }, { $set: h2 }, { upsert: true });
  ++it;
  if (it % batchSize == 0) {
    let percent = Math.round((it / max) * 100);
    let dat2 = new Date().getTime() / 1000;
    let perSec = Math.round(batchSize / (dat2 - dat));
    dat = dat2;
    print(it / 1000 + 'k ' + percent + '% ' + perSec + '/s');
  }
});
