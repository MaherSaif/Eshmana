function(doc) {
  if (doc.edited && doc.word && doc.meaning) {
    emit(doc.letter, doc);
  }
}