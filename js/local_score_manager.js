window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalScoreManager(getter, setter) {
  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
  var _this = this;
  this.getter = getter || function(callback) {
    callback(0);
  };
  this.setter = setter || function(score) {
    //Do nothing...
  };
}

LocalScoreManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

LocalScoreManager.prototype.get = function (callback) {
  return this.getter(callback);
};

LocalScoreManager.prototype.set = function (score) {
  this.setter(score);
};

