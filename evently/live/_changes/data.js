function(data) {
  return {
    items : data.rows.map(function(r) {
      r.value['tweet-data'].user.tweet_id_str = r.value['tweet-data'].id_str;
      return r;
    })
  }
};