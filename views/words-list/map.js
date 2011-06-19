function(doc) {
  if (doc.edited && doc.word && doc.meaning) {
    emit(doc.word, {'_id': doc._id, 'word': doc.word, 'letter': doc.letter});
  }
}