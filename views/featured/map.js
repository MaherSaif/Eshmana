function(doc) {
  if (doc.featured) {
      emit(doc.word, doc);
  }
}