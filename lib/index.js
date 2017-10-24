
/**
 * Class Safe42
 */
class Safe42 {
  /**
   * @constructor
   * @param {Object} storage
   *
   */
  constructor() {
    this._storage = storage;
    this._currentPassword;
    this._countBadPassword;
    this._delayInactivity;

    this._initialize();
  }

  /**
   * Initialize
   * @return {Safe42}
   */
  _initialize () {
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
    this._setTimeoutDigitsByTimer = this._setTimeoutDigitsByTimer = setTimeout(function() {}, 0);

  }

  /**
   * Run
   * @return {Safe42}
   */  
  run () {
    this._onClickDigits((key) => {
      this._setCurrentPassword(key);
      this._settingsDisplayScreen.default.message = this._setEncodeCurrentPassword(this._currentPassword);
      this._renderDisplayScreen(this._settingsDisplayScreen.default);

      if (this._getAction(key)) {
        this._getAction(key)();
      }
    });

    return this;
  }

  /**
   * set current password
   * @param {string} key
   * @return {bool} true/false
   */
  _setCurrentPassword (key) {
    if (key === 'ENTER' || key === 'DELETE' || key === 'UPDATE') {
      return false;
    }

    this._currentPassword = ! this._currentPassword ? this._currentPassword = key : this._currentPassword += key;

    return false
  }

  /**
   * Get action
   * @param {string} key
   * @return {function} actions[action]
   * @return {bool} false
   */
  _getAction (key) {
    var action = key.toLowerCase();
    var actions = {
      'enter': () => {
        if (! this._checkPassword(this._currentPassword)) {
          this._settingsDisplayScreen.error.message = 'Bad password';
          this._renderDisplayScreen(this._settingsDisplayScreen.error);
          this._countLimitPassword(this._countBadPassword);
          this._currentPassword = '';

          return;
        }

        this._settingsDisplayScreen.success.message = 'Your password is valid!';
        this._renderDisplayScreen(this._settingsDisplayScreen.success);
        this._renderDataConsole(this._getDataStorage(this._currentPassword));
        this._currentPassword = '';

        return;
      },
      'delete': () => {
        this._settingsDisplayScreen.success.message = 'data removed!';
        this._renderDisplayScreen(this._settingsDisplayScreen.success);

        console.log(this._deleteDataStorage(this._currentPassword));
        this._currentPassword = '';
      },
      'update': () => {
        this._settingsDisplayScreen.success.message = 'data updated!';
        this._renderDisplayScreen(this._settingsDisplayScreen.success);

        console.log(this._updateDataStorage({'tutu': 'tutu'}, this._currentPassword));
        this._currentPassword = '';
      }
    };

    if (! actions[action]) {
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
  _onClickDigits (callback) {
    var elButtons = document.querySelectorAll('#digits button');

    elButtons.forEach((elButton) => {
      elButton.addEventListener('click', (e) => {
        this._inactivityDigitsByTimer(this._delayInactivity);

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
  _checkPassword (password) {
    let result = false;

    this._storage.forEach((item) => {
      if (item.password == password) {
        result = true;
        this._countBadPassword = 0;
      }
    });

    if (! result) {
      this._countBadPassword += 1;
    }

    return result;
  }

  /**
   * Get storage
   * @param {string} password
   * @return {object} data
   */
  _getDataStorage (password) {
    var data = {};

    this._storage.forEach((item) => {
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
  _deleteDataStorage (password) {
    var data = {};

    this._storage.forEach((item, index) => {
      if (item.password == password) {
        this._storage[index].data = {};
        data = this._storage[index];
      }
    });

    return data;
  }

  /**
   * Update data storage
   * @param {object} dataUpdate
   * @return {object} data
   */
  _updateDataStorage (dataUpdate, password) {
    const newData = dataUpdate;
    let data = {};

    this._storage.forEach((item, index) => {
      if (item.password == password) {
        this._storage[index].data = newData;
        data = this._storage[index];
      }
    });

    return data;
  }


  /**
   * Set encode current password
   * @param {string} password
   * @return {string} encodePassword
   */
  _setEncodeCurrentPassword (password) {
    return password.replace(/\d/gi, 'x');
  }

  /**
   * Template display screen
   * @param {object} settings
   * @reutrn {string} dom
   */
  _tplDisplayScreen (settings) {
    let dom = '<div class="alert alert-' + settings.type + '" role="alert">';
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
  _renderDisplayScreen (settings) {
    const el = document.querySelector('#display-screen .col');

    el.innerHTML = this._tplDisplayScreen(settings);

    return this;
  }

  /**
   * Render data console
   * @param {object} data
   * @return {string} dom
   */
  _renderDataConsole (data) {
    const el = document.querySelector('#console .list-group');
    let dom = '';

    for (let key in data) {
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
  _tplDataConsole (key, value) {
    return '<li class="list-group-item list-group-item-error"><strong>'+ key +' -----></strong> '+ value +'</li>';
  }

  /**
   * Template data console
   * @param {string} key
   * @param {string} value
   * @return {string} dom
   */
  _countLimitPassword (countBadPassword) {
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
  _inactivityDigitsByTimer (delay) {
    clearTimeout(this._setTimeoutDigitsByTimer);

    this._setTimeoutDigitsByTimer = setTimeout(() => {
      this._settingsDisplayScreen.default.message = '';
      this._renderDisplayScreen(this._settingsDisplayScreen.default);
      this._currentPassword = '';
    }, delay);
  }
}

const storage = [{
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
    'name': 'Stephanie',
    'age': 30,
    'sexe': 'femme'
  }
}];

const safe42 = new Safe42(storage);

safe42.run();