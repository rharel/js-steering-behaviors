/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Seek = require('./Seek');
var Predictor = require('../utility/Predictor');


function Pursuit(target, desired_speed, evasion, predictor) {

  this._target = target;
  this._predict_position = predictor || Predictor.constant(0.1);
  this._seek = new Seek(target.position, desired_speed, evasion);
}


Pursuit.prototype = {

  constructor: Pursuit,

  drive: function(character, dt) {

    dt = dt || 1;

    this._seek.target.copy_(
      this._predict_position(this._target)
    );

    return this._seek.drive(character, dt);
  },

  get target() { return this._target; },
  set target(character) { this._target = character; },

  get desired_speed() { return this._seek.desired_speed; },
  set desired_speed(value) { this._seek.desired_speed = value; },

  get evasion() { return this._seek.flee; },
  set evasion(value) { this._seek.flee = value; },

  get predictor() { return this._predict_position; },
  set predictor(fn) { this._predict_position = fn; }
};


module.exports = Pursuit;
