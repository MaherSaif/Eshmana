function(doc) {
  if (doc.type == 'definition' && doc.live) {
    emit(Date.parse(doc['tweet-data'].created_at), doc);
  }
};