/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Vec2 = require('../math/Vec2');


var RIGHT = new Vec2(1, 0);


var default_properties = {

  mass: 1,

  position: new Vec2(0, 0),
  orientation: 0,

  velocity: new Vec2(0, 0),

  max_force: 1,
  max_speed: 1
};

function Character(properties) {

  if (typeof properties === 'undefined') {

    properties = default_properties;
  }

  else {

    for (var key in default_properties) {

      if (default_properties.hasOwnProperty(key) &&
         !properties.hasOwnProperty(key)) {

        properties[key] = default_properties[key];
      }
    }
  }

  this._mass = properties.mass;
  this._mass_inverse = 1 / this._mass;

  this._position = properties.position.clone();
  this._orientation = properties.orientation;

  this._velocity = properties.velocity.clone();

  this._max_force = properties.max_force;
  this._max_speed = properties.max_speed;

  this._net_force = new Vec2(0, 0);
}


Character.prototype = {

  constructor: Character,

  apply_force: function(F) {

    this._net_force.add_(F);
  },

  step: function(dt) {

    var acceleration;

    truncate(this._net_force, this._max_force);
    acceleration = this._net_force.scale(this._mass_inverse * dt);

    this._velocity.add_(acceleration);
    truncate(this._velocity, this._max_speed);

    this._position.add_(this._velocity.scale(dt));
    this._orientation = RIGHT.signed_angle(this._velocity);
  },

  get mass() { return this._mass; },
  set mass(value) {

    this._mass = +value;
    this._mass_inverse = 1 / this._mass;
  },

  get position() { return this._position; },
  get orientation() { return this._orientation; },

  get velocity() { return this._velocity; },

  get max_force() { return this._max_force;},
  set max_force(value) { this._max_force = +value; },

  get max_speed() { return this._max_speed; },
  set max_speed(value) { this._max_speed = +value; },

  get net_force() { return this._net_force; }
};


function truncate(v, max) {

  var len = v.len();
  if (len > max) { v.scale_(max / len); }

  return v;
}


module.exports = Character;
