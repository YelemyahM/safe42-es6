'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Safe42
 */
var Safe42 = function () {
  /**
   * @constructor
   */
  function Safe42() {
    _classCallCheck(this, Safe42);

    this._storage = storage;
    this._currentPassword;
    this._countBadPassword;
    this._delayInactivity;
    this._inactivityDigitsByTimer;

    this._initialize();
  }

  /**
   * Initialize
   * @return {Safe42}
   */


  _createClass(Safe42, [{
    key: '_initialize',
    value: function _initialize() {
      this._settingsDisplayScreen = {
        'default': {
          'type': 'info',
          'title': 'INFO',
          'message': ''
        },
        'success': {
          'type': 'success',
          'title': 'SUCCESS',
          'message': ''
        },
        'warning': {
          'type': 'warning',
          'title': 'WARNING',
          'message': ''
        },
        'error': {
          'type': 'danger',
          'title': 'ERROR',
          'message': ''
        }
      };
      this._delayInactivity = 10000;
      this._renderDisplayScreen(this._settingsDisplayScreen.default);
      this._setTimeoutDigitsByTimer = this._setTimeoutDigitsByTimer = setTimeout(function () {}, 0);
    }

    /**
     * Run
     * @return {Safe42}
     */

  }, {
    key: 'run',
    value: function run() {
      var _this = this;

      this._onClickDigits(function (key) {
        _this._setCurrentPassword(key);
        _this._settingsDisplayScreen.default.message = _this._setEncodeCurrentPassword(_this._currentPassword);
        _this._renderDisplayScreen(_this._settingsDisplayScreen.default);

        if (_this._getAction(key)) {
          _this._getAction(key)();
        }
      });

      return this;
    }

    /**
     * set current password
     * @param {string} key
     * @return {bool} true/false
     */

  }, {
    key: '_setCurrentPassword',
    value: function _setCurrentPassword(key) {
      if (key === 'ENTER' || key === 'DELETE' || key === 'UPDATE') {
        return false;
      }

      this._currentPassword = !this._currentPassword ? this._currentPassword = key : this._currentPassword += key;

      return false;
    }

    /**
     * Get action
     * @param {string} key
     * @return {function} actions[action]
     * @return {bool} false
     */

  }, {
    key: '_getAction',
    value: function _getAction(key) {
      var _this2 = this;

      var action = key.toLowerCase();
      var actions = {
        'enter': function enter() {
          if (!_this2._checkPassword(_this2._currentPassword)) {
            _this2._settingsDisplayScreen.error.message = 'Bad password';
            _this2._renderDisplayScreen(_this2._settingsDisplayScreen.error);
            _this2._countLimitPassword(_this2._countBadPassword);
            _this2._currentPassword = '';

            return;
          }

          _this2._settingsDisplayScreen.success.message = 'Your password is valid!';
          _this2._renderDisplayScreen(_this2._settingsDisplayScreen.success);
          _this2._renderDataConsole(_this2._getDataStorage(_this2._currentPassword));
          _this2._currentPassword = '';

          return;
        },
        'delete': function _delete() {
          _this2._settingsDisplayScreen.success.message = 'data removed!';
          _this2._renderDisplayScreen(_this2._settingsDisplayScreen.success);

          console.log(_this2._deleteDataStorage(_this2._currentPassword));
          _this2._currentPassword = '';
        },
        'update': function update() {
          _this2._settingsDisplayScreen.success.message = 'data updated!';
          _this2._renderDisplayScreen(_this2._settingsDisplayScreen.success);

          console.log(_this2._updateDataStorage({ 'tutu': 'tutu' }, _this2._currentPassword));
          _this2._currentPassword = '';
        }
      };

      if (!actions[action]) {
        return false;
      }

      clearTimeout(this._setTimeoutDigitsByTimer);

      return actions[action];
    }

    /**
     * On click digits
     * @param {function} callback
     * @return {Safe42}
     */

  }, {
    key: '_onClickDigits',
    value: function _onClickDigits(callback) {
      var _this3 = this;

      var elButtons = document.querySelectorAll('#digits button');

      elButtons.forEach(function (elButton) {
        elButton.addEventListener('click', function (e) {
          _this3._inactivityDigitsByTimer(_this3._delayInactivity);

          callback(e.target.textContent);
        });
      });

      return this;
    }

    /**
     * Check password
     * @param {string} password
     * @return {bool} checked
     */

  }, {
    key: '_checkPassword',
    value: function _checkPassword(password) {
      var _this4 = this;

      var result = false;

      this._storage.forEach(function (item) {
        if (item.password == password) {
          result = true;
          _this4._countBadPassword = 0;
        }
      });

      if (!result) {
        this._countBadPassword += 1;
      }

      return result;
    }

    /**
     * Get storage
     * @param {string} password
     * @return {object} data
     */

  }, {
    key: '_getDataStorage',
    value: function _getDataStorage(password) {
      var data = {};

      this._storage.forEach(function (item) {
        if (item.password == password) {
          data = item.data;
        }
      });

      return data;
    }

    /**
     * Delete data storage
     * @param {string} password
     * @return {object} data
     */

  }, {
    key: '_deleteDataStorage',
    value: function _deleteDataStorage(password) {
      var _this5 = this;

      var data = {};

      this._storage.forEach(function (item, index) {
        if (item.password == password) {
          _this5._storage[index].data = {};
          data = _this5._storage[index];
        }
      });

      return data;
    }

    /**
     * Update data storage
     * @param {object} dataUpdate
     * @return {object} data
     */

  }, {
    key: '_updateDataStorage',
    value: function _updateDataStorage(dataUpdate, password) {
      var _this6 = this;

      var newData = dataUpdate;
      var data = {};

      this._storage.forEach(function (item, index) {
        if (item.password == password) {
          _this6._storage[index].data = newData;
          data = _this6._storage[index];
        }
      });

      return data;
    }

    /**
     * Set encode current password
     * @param {string} password
     * @return {string} encodePassword
     */

  }, {
    key: '_setEncodeCurrentPassword',
    value: function _setEncodeCurrentPassword(password) {
      return password.replace(/\d/gi, 'x');
    }

    /**
     * Template display screen
     * @param {object} settings
     * @reutrn {string} dom
     */

  }, {
    key: '_tplDisplayScreen',
    value: function _tplDisplayScreen(settings) {
      var dom = '<div class="alert alert-' + settings.type + '" role="alert">';
      dom += '<h4 class="alert-heading">' + settings.title + '</h4>';
      dom += '<p>' + settings.message + '</p>';
      dom += '</div>';

      return dom;
    }

    /**
     * Render display screen
     * @param {object} settings
     * @return {Safe42}
     */

  }, {
    key: '_renderDisplayScreen',
    value: function _renderDisplayScreen(settings) {
      var el = document.querySelector('#display-screen .col');

      el.innerHTML = this._tplDisplayScreen(settings);

      return this;
    }

    /**
     * Render data console
     * @param {object} data
     * @return {string} dom
     */

  }, {
    key: '_renderDataConsole',
    value: function _renderDataConsole(data) {
      var el = document.querySelector('#console .list-group');
      var dom = '';

      for (var key in data) {
        dom += this._tplDataConsole(key, data[key]);
      }

      el.innerHTML = dom;

      return this;
    }

    /**
     * Template data console
     * @param {string} key
     * @param {string} value
     * @return {string} dom
     */

  }, {
    key: '_tplDataConsole',
    value: function _tplDataConsole(key, value) {
      return '<li class="list-group-item list-group-item-error"><strong>' + key + ' -----></strong> ' + value + '</li>';
    }

    /**
     * Template data console
     * @param {string} key
     * @param {string} value
     * @return {string} dom
     */

  }, {
    key: '_countLimitPassword',
    value: function _countLimitPassword(countBadPassword) {
      if (countBadPassword == 3) {
        this._settingsDisplayScreen.error.message = 'Kim Jung Un bomber-H!';
        this._renderDisplayScreen(this._settingsDisplayScreen.error);
        this._storage = [];
        this._countBadPassword = 0;
      }

      return this;
    }

    /**
     * Template data console
     * @param {string} key
     * @param {string} value
     * @return {string} dom
     */

  }, {
    key: '_inactivityDigitsByTimer',
    value: function _inactivityDigitsByTimer(delay) {
      var _this7 = this;

      clearTimeout(this._setTimeoutDigitsByTimer);

      this._setTimeoutDigitsByTimer = setTimeout(function () {
        _this7._settingsDisplayScreen.default.message = '';
        _this7._renderDisplayScreen(_this7._settingsDisplayScreen.default);
        _this7._currentPassword = '';
      }, delay);
    }
  }]);

  return Safe42;
}();

var storage = [{
  'id': '1',
  'password': '42',
  'data': {
    'name': 'cyril',
    'age': 30,
    'sexe': 'male'
  }
}, {
  'id': '2',
  'password': '12345',
  'data': {
    'name': 'toto',
    'age': 30,
    'sexe': 'E.T'
  }
}];

var safe42 = new Safe42(storage);

safe42.run();