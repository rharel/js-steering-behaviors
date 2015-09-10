/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Seek = require('./Seek');
var Easing = require('../utility/Easing');
var Vec2 = require('../math/Vec2');


var EPSILON = 0.001;


/**
 * Drives a character towards a given target position.
 *
 * @details
 *    Up until a given distance D from the target, this behavior is identical
 *    to Seek. When the character is <= D units away from the target, it will start breaking
 *    to a standstill.
 *
 * @param {Vec2} target
 *    Target position.
 *
 * @param {number} desired_speed
 *    Cruising speed when outside of breaking radius.
 *
 * @param {number} breaking_distance
 *    Distance to the target from which to start breaking.
 *
 * @param {callback} [easing=Easing.linear]
 *    Easing function [fn(a, b, t) => x] applied to the character's velocity
 *    once inside the breaking radius.
 *
 * @constructor
 */
function Arrival(target, desired_speed, breaking_distance, easing) {

  this._desired_speed = desired_speed;
  this._seek = new Seek(target, desired_speed);
  this._breaking_distance = breaking_distance;
  this._ease = easing || Easing.linear;
}


Arrival.prototype = {

  constructor: Arrival,

  drive: function(character, dt) {

    dt = dt || 1;

    var distance = character.position.distance(this._seek.target);

    if (distance < EPSILON) { distance = 0; }

    if (distance <= this._breaking_distance) {

      this._seek.desired_speed = this._ease(

        0, this._desired_speed, distance / this._breaking_distance
      );
    }

    else { this._seek.desired_speed = this._desired_speed; }

    return this._seek.drive(character, dt);
  },

  get target() { return this._seek.target;},

  get desired_speed() { return this._desired_speed; },
  set desired_speed(value) { this._desired_speed = +value; },

  get breaking_distance() { return this._breaking_distance; },
  set breaking_distance(value) { this._breaking_distance = +value; }
};


module.exports = Arrival;
