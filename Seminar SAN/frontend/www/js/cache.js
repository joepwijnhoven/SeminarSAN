var Utils = (function () {
  function find(array, field, value) {
    var index = indexOf(array, field, value);
    if (index > -1) {
      return array[index];
    } else {
      return undefined;
    }
  }

  function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle File (do not clone)
    if (obj instanceof File) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      var copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      var copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to clone object. Its type isn't supported.");
  }

  function merge(obj1, obj2) {
    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
    return obj1;
  }

  function indexOf(array, field, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][field] == value) return i;
    }
    return -1;
  }

  return {
    find: find,
    clone: clone,
    merge: merge,
    indexOf: indexOf    
  }
}());

function AppCache() {
  this.data = {};

  // hide the observable inside of the cache (avoid conflicting methods)
  this.observable = {};
  riot.observable(this.observable);
}

AppCache.find = function (data, path) {
  var oldPath = path;
  path = path.split(".");
  var value = data;
  for (var i = 0; i < path.length; i++) {
    var key = path[i];

    if (Array.isArray(value)) {
      value = Utils.find(value, "id", key);
    } else if (typeof value === "object") {
      value = value[key];
    } else {
      throw "wrong path " + oldPath
    }

    if (typeof value === "undefined") return undefined;
  }
  return value;
}

AppCache.prototype.clear = function (path) {
  if (path) {
    this.set(path, undefined);
  } else {
    delete this.data;
    this.data = {};
  }
}

/*
 * Retrieve a cached object by its path in the cache tree.
 * The path argument can be:
 *   array of strings: each element represents a node on the path,
 *   string: equivalent to an array containing the single string
 */

AppCache.prototype.get = function (path) {
  return Utils.clone(AppCache.find(this.data, path));
}

AppCache.prototype.set = function (pathString, value, options) {
  options = Utils.merge({
    silent: false
  }, options);

  var path = pathString.split(".");

  if (!path.length) { throw "Path must have length > 0"; }

  var node = this.data;
  var key;
  for (var i = 0; i < path.length - 1; i++) {
    key = path[i];

    if (Array.isArray(node)) {
      node = Utils.find(node, "id", key);
    } else if (typeof node === "object") {
      node = node[key];
    } else {
      throw "wrong node type '" + typeof node + "'"
    }

    if (!node) {
      throw "trying to set cache value with wrong path '" + pathString + "'"
    }
  }

  key = path[i];

  var oldValue;

  // clone the value to avoid hidden references and unexpected
  // behavior if one of the references is updated
  value = Utils.clone(value);

  if (Array.isArray(node)) {
    oldValue = Utils.clone(node);
    var index = Utils.indexOf(node, "id", key)
    if (index > -1) {
      if (typeof value == "undefined") {
        node.splice(index, 1);  
      } else {
        node.splice(index, 1, value);        
      }
    } else {
      node.push(value)
    }
  } else if (typeof node === "object") {
    oldValue = Utils.clone(node[key]);
    if (typeof value == "undefined") {
      delete node[key];
    } else {
      node[key] = value;
    }
  } else {
    throw "wrong node type of last node"
  }

  // include the old value, in order to distinguish in the handler between
  // an undefined value and clearing an old value
  if (!options.silent) {
    this.trigger(pathString, oldValue);
  }
}

AppCache.prototype.trigger = function (pathString, oldValue) {
  this.observable.trigger(pathString, oldValue);
}

AppCache.prototype.push = function (path, value) {
  var array = this.get(path) || [];
  array.push(value);
  this.set(path, array);
}

AppCache.prototype.on = function (path, handler) {
  var that = this;
  function notify(oldValue) {
    // catch errors, e.g. in case the riot node was removed from DOM
    try {
      handler.call({}, that.data[path], oldValue); 
    } catch (err) {
      console.error("ERROR cache:", err);
    }
  }
  this.observable.on(path, notify);

  // notify if there is a value at the path
  if (this.data[path]) notify();

  return notify;
}

AppCache.prototype.off = function (path, handler) {
  this.observable.off(path, handler);
}

AppCache.prototype.retrieve = function (path) {
  var that = this;
  var promise = new Promise(function (resolve, reject) {
    if (typeof that.data[path] == "undefined") {
      reject();
    } else {
      resolve(that.data[path]);
    }
  });

  return promise;
}

var cache = new AppCache();

var AppCacheMixin = {
  cacheOn: function (paths, handler) {
    var that = this;
    
    if (typeof paths == "string") {
      paths = [paths];
    }

    function dispatch(value, oldValue) {
      // collect values at all paths
      var ok = true;
      var values = paths.map(function (path) {
        var value = cache.get(path);
        ok = ok && (typeof value != "undefined" || typeof oldValue != "undefined");
        return value;
      });

      // call handler when all values are present
      if (ok) {
        var callUpdate = handler.apply(that, values);

        // update the component, if not explicitely canceled
        if (callUpdate !== false) {
          that.update();
        }
      }
      //else { console.log("some values missing", values)}
    }

    paths.forEach(function (path) {
      that.on("mount", function () {
        var notify = cache.on(path, dispatch);
        that.on("unmount", function () {
          cache.off(path, notify);
        })
      });
    });
  }
}

riot.mixin('cache_mixin', AppCacheMixin)


