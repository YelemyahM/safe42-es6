<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Safe42 to ES6](#safe42-to-es6)
  - [Introduction :](#introduction-)
  - [Pré-requis :](#pr%C3%A9-requis-)
  - [Comment l'utiliser :](#comment-lutiliser-)
  - [Fonctions :](#fonctions-)
    - [Exemple d'utilisation :](#exemple-dutilisation-)
    - [Fonctions :](#fonctions--1)
      - [**@Constructeur** :](#constructeur-)
      - [**_initialize()**](#_initialize)
      - [**_onClickDigits**](#_onclickdigits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Safe42 to ES6

## Introduction :

Safe42 est une coffre qui permet d'enregistrer ses données personnelles et d'y accéder grâce à un code d'accès. 

## Pré-requis :

* Installer `nodejs` & `npm`

## Comment l'utiliser :

* `git clone https://github.com/xzen/safe42-es6.git`
* `npm i`

## Fonctions :

### Exemple d'utilisation :

```javascript
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
```

### Fonctions :

#### **@Constructeur** :

Paramètres : 

Nom                      | Type   | Valeur 
------------------------ | ------ | -------
_storage                 | Object | {}
_currentPassword         | String | '42'
_countBadPassword        | Number | 2
_delayInactivity       | Number | 10000

#### **_initialize()**

Permet d'initialiser le safe42 avec le `_renderDisplayScreen`

Paramètres : 

Nom   | Type      | Valeur 
----- | --------- | --------------
 id   | String    | '485739303923'
 
#### **_onClickDigits**

Permet de capturer et de récupérer les valeurs des touches appuyées.

Paramètres : 

Nom         | Type      | Valeur 
----------- | --------- | --------------
callback    | function  | (key) => {}

exemple : 
```javascript
  this._onClickDigits((key) => {
    console.log(key) // Récupère le triger de l'événement 'click'
  });
```