/**
 * Class Data storage
 */
class DataStorage {
  /**
   * @constructor
   * @param {Object} storage
   */
  constructor (storage) {
    this.storage = storage;
  }

  /**
   * Get
   * @param {string} password
   * @return {object} data
   */
  get (password) {
    let data = {};

    this.storage.forEach((item) => {
      if (item.password == password) {
        data = item.data;
      }
    });

    return data;
  }

  /**
   * Delete
   * @param {string} password
   * @return {object} data
   */
  delete (password) {
    let data = {};

    this.storage.forEach((item, index) => {
      if (item.password == password) {
        this.storage[index].data = {};
        data = this.storage[index];
      }
    });

    return data;
  }

  /**
   * Update
   * @param {object} dataUpdate
   * @return {object} data
   */
  update (dataUpdate, password) {
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
}

class DisplayScreen {
  constructor () {
    this.settings = {
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
  }

  /**
   * Template
   * @param {Object} settings
   * @return {string} dom
   */
  tpl (settings) {
    let dom = '<div class="alert alert-' + settings.type + '" role="alert">';
      dom += '<h4 class="alert-heading">' + settings.title + '</h4>';
      dom += '<p>' + settings.message + '</p>';
    dom += '</div>';

    return dom;
  }

  setMessage (type, message) {
    for (let key in this.settings) {
      if (key === type) {
        this.settings[key].message = message;

        return this.settings[key];
      }
    }

    return {};
  }

  /**
   * Render
   * @param {string} type
   * @return {DisplayScreen}
   */
  render (type) {
    const el = document.querySelector('#display-screen .col');

    el.innerHTML = this.tpl(this.settings[type]);

    return this;
  }
}


/**
 * Class Safe42
 */
class Safe42 {
  /**
   * @constructor
   * @param {Object} storage
   */
  constructor(storage) {
    this._storage = storage;
    this.dataStorage = new DataStorage(this._storage);
    this.displayScreen = new DisplayScreen();
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
    this._delayInactivity = 10000;
    this.displayScreen.render('default');
    this._setTimeoutDigitsByTimer = this._setTimeoutDigitsByTimer = setTimeout(function() {}, 0);

  }

  /**
   * Run
   * @return {Safe42}
   */  
  run () {
    this._onClickDigits((key) => {
      this._setCurrentPassword(key);
      this.displayScreen.setMessage('default', this._setEncodeCurrentPassword(this._currentPassword));
      this.displayScreen.render('default');

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
    const action = key.toLowerCase();
    const actions = {
      'enter': () => {
        if (! this._checkPassword(this._currentPassword)) {
          this.displayScreen.setMessage('error', 'Bad password!');
          this.displayScreen.render('error');
          this._countLimitPassword(this._countBadPassword);
          this._currentPassword = '';

          return;
        }

        this.displayScreen.setMessage('success', 'Your password is valid!');
        this.displayScreen.render('success');
        this._renderDataConsole(this.dataStorage.get(this._currentPassword));
        this._currentPassword = '';

        return;
      },
      'delete': () => {
        this.displayScreen.setMessage('success', 'data removed!'); // this.displayScreen.setMessage(''data removed!'')
        this.displayScreen.render('success'); // this.displayScreen.render('success')
        this._currentPassword = '';
      },
      'update': () => {
        this.displayScreen.setMessage('success', 'data updated!');
        this.displayScreen.render('success');
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
    const elButtons = document.querySelectorAll('#digits button');

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
   * Set encode current password
   * @param {string} password
   * @return {string} encodePassword
   */
  _setEncodeCurrentPassword (password) {
    return password.replace(/\d/gi, 'x');
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
      this.displayScreen.setMessage('error', 'Kim Jung Un bomber-H!')
      this.displayScreen.render('error');
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
      this.displayScreen.setMessage('default', '');
      this.displayScreen.render('default');
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