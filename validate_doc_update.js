function (newDoc, oldDoc, userCtx) {
  if (userCtx.roles.indexOf('_admin') == -1) {
    throw({forbidden : 'no way'});    
  }
};