/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Vec2 = require('../math/Vec2');


var RIGHT = new Vec2(1, 0);


function Wander(max_turn, max_turn_rate, speed) {

  this._max_turn = Math.abs(max_turn);
  this._max_turn_rate = Math.abs(max_turn_rate);
  this._speed = speed;

  this._current_angle = 0;
}


Wander.prototype = {

  constructor: Wander,

  drive: function(character) {

    this._current_angle += random_in_range(
      -this._max_turn_rate,
       this._max_turn_rate
    );

    this._current_angle = Math.min(
      this._max_turn,
      Math.max(-this._max_turn, this._current_angle)
    );

    var force;
    force = RIGHT.rotate(character.orientation + this._current_angle);
    force.scale_(this._speed);

    return force;
  },

  get max_turn() { return this._max_turn; },
  set max_turn(value) { this._max_turn = Math.abs(+value); },

  get max_turn_rate() { return this._max_turn_rate; },
  set max_turn_rate(value) { this._max_turn_rate = Math.abs(+value); },

  get speed() { return this._speed; },
  set speed(value) { this._speed = +value; }
};


function random_in_range(a, b) {

  return a + (b - a) * Math.random();
}


module.exports = Wander;
