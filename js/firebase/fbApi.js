var shortid = require('shortid');

var fbRequestQueue = {};
// using a temporary jFirebase javascript object to ease testing from javascript.
// In production, this is to be replaced with fbApi
var fbApi = {
  connect: function() {
    let path, data, cb;
    let args = arguments;
    let token = shortid.generate();
    let key = args[0];
    switch (key) {
      case 'get':
        if(args.length != 3) return;
        path = args[1];
        cb = args[2];
        jFirebase.get(token, path);
        break;
      case 'set':
        if(args.length != 4) return;
        path = args[1];
        data = args[2];
        cb = args[3];
        jFirebase.set(token, path, data);
        break;
      case 'update':
        if(args.length != 4) return;
        path = args[1];
        data = args[2];
        cb = args[3];
        jFirebase.update(token, path, data);
        break;
      case 'increment':
        if(args.length != 3) return;
        path = args[1];
        cb = args[2];
        jFirebase.increment(token, path);
        break;
      case 'decrement':
        if(args.length != 3) return;
        path = args[1];
        cb = args[2];
        jFirebase.decrement(token, path);
        break;
      case 'onChildAdded':
        if(args.length != 3) return;
        let stickyToken = 'stick#' + token;
        path = args[1];
        cb = args[2];
        jFirebase.onChildAdded(stickyToken, path);
        break;
      case 'offChildAdded':
        if(args.length != 2) return;
        let unstickyToken = 'unstick#' + token;
        path = args[1];
        jFirebase.offChildAdded(unstickyToken, path);
        break;
      default: return;
    }
    switch (key) {
      case 'get':
      case 'set':
      case 'update':
      case 'increment':
      case 'decrement':
        fbRequestQueue[token] = cb;
        break;
      case 'onChildAdded':
        let stickyToken = 'stick#' + token;
        fbRequestQueue[stickyToken] = {path: path, cb: cb};
        break;
      case 'offChildAdded':
      let unstickyToken = 'unstick#' + token;
      fbRequestQueue[unstickyToken] = path;
      break;
    }
  },
  onSuccessResponse : function(token, data) {
    let rt = fbRequestQueue[token];
    switch (typeof rt) {
      case 'object':
        rt.cb(null, data);
        break;
      case 'function':
        rt(null, data);
        delete fbRequestQueue[token];
        break;
      case 'string':
        for (let [key, item] of fbRequestQueue) {
          if(typeof item === 'object' && item.path === rt) {
            delete fbRequestQueue[key];
            delete fbRequestQueue[token];
            return;
          }
        }
        break;
    }
  },
  onErrorResponse : function(token, error) {
    let rt = fbRequestQueue[token];
    switch (typeof rt) {
      case 'object':
        rt.cb(error);
        break;
      case 'function':
        rt(error);
        delete fbRequestQueue[token];
        break;
      case 'string':
        delete fbRequestQueue[token];
        break;
    }
  }
};
module.exports = fbApi;
