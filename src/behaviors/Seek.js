/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function Seek(target, desired_speed, flee) {

  this._target = target.clone();
  this._desired_speed = desired_speed;
  this._flee = flee || false;
}


Seek.prototype = {

  constructor: Seek,

  drive: function(character) {

    var desired_velocity =
      this._target
        .sub(character.position)
        .unit_()
        .scale_(this._desired_speed);

    if (this._flee) { desired_velocity.scale_(-1); }

    return desired_velocity.sub(character.velocity).scale_(character.mass);
  },

  get target() { return this._target; },

  get desired_speed() { return this._desired_speed; },
  set desired_speed(value) { this._desired_speed = +value; },

  get flee() { return this._flee; },
  set flee(value) { this._flee = !!value; }
};


module.exports = Seek;
