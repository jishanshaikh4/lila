// var studyId = '0Obg93mv';

function dig(chapId, node, path) {
  for (let i in node.n) {
    let c = node.n[i];
    let newPath = `${path}.n.${i}`;
    if (!c || !c.i) {
      let set = {};
      set[`${path}.n`] = [];
      printjson(set);
      db.study_chapter.update({_id : chapId}, {$set : set});
    } else {
      dig(chapId, c, newPath);
    }
  }
}

// db.study_chapter.find({studyId: studyId}).forEach(chap => {
db.study_chapter.find({}).forEach(chap => {
  print(`${chap.studyId}/${chap._id}`);
  dig(chap._id, chap.root, 'root');
});
