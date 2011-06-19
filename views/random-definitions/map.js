function(doc) {
  if (doc.edited && doc.word && doc.meaning) {
    emit(Math.random(), doc);
  }
}