let users = [ 'blitzstream-twitch', 'legend', 'admirala', 'hellball' ];

for (let i in users) {
  let kind = i == 0 ? 'marathonWinner' : 'marathonTopTen';
  let user = users[i];
  db.trophy.insert({
    _id : kind + '/' + user,
    user : user,
    kind : kind,
    date : new Date(),
  });
}
