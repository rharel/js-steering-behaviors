(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../math/Vec2":9,"../utility/Easing":11,"./Seek":4}],2:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Vec2 = require('../math/Vec2');


/**
 * Drives a character closer to the central position of nearby characters.
 *
 * @param {callback} nearest_neighbours
 *    Callback that evaluates and returns an array of characters that are considered
 *    'nearby'. The callback accepts a single Vec2 argument indicating the driven character's
 *    current position.
 *
 * @param {callback} attraction_weight
 *    Callback that controls the scaling of the attracting force. The callback accepts a single
 *    scalar argument indicating the distance between the driven character and the central
 *    attraction point.
 *
 * @constructor
 */
function Cohesion(nearest_neighbours, attraction_weight) {

  this._nearest_neighbours = nearest_neighbours;
  this._attraction_weight = attraction_weight;
}


Cohesion.prototype = {

  constructor: Cohesion,

  drive: function(character, dt) {

    dt = dt || 1;

    var average_position = new Vec2(0, 0);

    var neighbours = this._nearest_neighbours(character.position);

    if (neighbours.length === 1) {

      return character.velocity.scale(-character.mass / dt);
    }

    else {

      neighbours.forEach(

        function(neighbour) { average_position.add_(neighbour.position); }
      );

      average_position.scale_(1 / neighbours.length);

      return average_position
        .sub(character.position)
        .scale_(this._attraction_weight(
          character.position.distance(average_position)
        ));
    }
  }
};


module.exports = Cohesion;

},{"../math/Vec2":9}],3:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Seek = require('./Seek');
var Predictor = require('../utility/Predictor');


/**
 * Drives the character to pursue another character's position.
 *
 * @param {Character} target
 *    Character to pursue.
 *
 * @param {number} desired_speed
 *    Desired cruising speed.
 *
 * @param {boolean} evasion
 *    If true, drives the character away from the target instead of towards.
 *
 * @param {callback} predictor
 *    Callback used to predict the target's position in the future. It accepts a single argument
 *    that is the target character.
 *
 * @constructor
 */
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

},{"../utility/Predictor":12,"./Seek":4}],4:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * Drives the character towards a target position.
 *
 * @param {Vec2} target
 *    Destination.
 *
 * @param {number} desired_speed
 *    Desired cruising speed.
 *
 * @param {boolean} flee
 *    If true, drives the character away from the target instead of towards it.
 *
 * @constructor
 */
function Seek(target, desired_speed, flee) {

  this._target = target.clone();
  this._desired_speed = desired_speed;
  this._flee = flee || false;
}


Seek.prototype = {

  constructor: Seek,

  drive: function(character, dt) {

    dt = dt || 1;

    var desired_velocity =
      this._target
        .sub(character.position)
        .unit_()
        .scale_(this._desired_speed);

    if (this._flee) { desired_velocity.scale_(-1); }

    return desired_velocity.sub(character.velocity).scale_(character.mass / dt);
  },

  get target() { return this._target; },

  get desired_speed() { return this._desired_speed; },
  set desired_speed(value) { this._desired_speed = +value; },

  get flee() { return this._flee; },
  set flee(value) { this._flee = !!value; }
};


module.exports = Seek;

},{}],5:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Vec2 = require('../math/Vec2');


/**
 * Drives a character away from the central position of nearby characters.
 *
 * @param {callback} nearest_neighbours
 *    Callback that evaluates and returns an array of characters that are considered
 *    'nearby'. The callback accepts a single Vec2 argument indicating the driven character's
 *    current position.
 *
 * @param {callback} repulsion_weight
 *    Callback that controls the scaling of the repulsive force. The callback accepts a single
 *    scalar argument indicating the distance between the driven character and the central
 *    repulsion point.
 *
 * @constructor
 */
function Separation(nearest_neighbours, repulsion_weight) {

  this._nearest_neighbours = nearest_neighbours;
  this._repulsion_weight = repulsion_weight;
}


Separation.prototype = {

  constructor: Separation,

  drive: function(character, dt) {

    dt = dt || 1;

    var neighbours = this._nearest_neighbours(character.position);

    if (neighbours.length === 1) {

      return character.velocity.scale(-character.mass / dt);
    }

    else {

      var total_force = new Vec2(0, 0);

      neighbours.forEach(

        function(neighbour) {

          var repulsive_force =
            character.position
              .sub(neighbour.position)
              .unit_()
              .scale_(this._repulsion_weight(character.position.distance(neighbour.position)));

          total_force.add_(repulsive_force);
        },
        this
      );

      return total_force;
    }
  }
};


module.exports = Separation;

},{"../math/Vec2":9}],6:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Vec2 = require('../math/Vec2');


var RIGHT = new Vec2(1, 0);


/**
 * Drives the character in random directions.
 *
 * @param {number} max_turn
 *    Maximum turn angle (in radians).
 *
 * @param max_turn_rate
 *    Maximum change in turn angle from update to update.
 *
 * @param speed
 *    Desired cruising speed.
 *
 * @constructor
 */
function Wander(max_turn, max_turn_rate, speed) {

  this._max_turn = Math.abs(max_turn);
  this._max_turn_rate = Math.abs(max_turn_rate);
  this._speed = speed;

  this._current_angle = 0;
}


Wander.prototype = {

  constructor: Wander,

  drive: function(character, dt) {

    dt = dt || 1;

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
    force.scale_(this._speed * character.mass / dt);

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

},{"../math/Vec2":9}],7:[function(require,module,exports){
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


/**
 * Physical point-mass character driven by forces.
 *
 * @param {object} properties
 *    Initialization object with the following optional properties:
 *      - mass {number}: Body mass.
 *      - position {Vec2}: Initial position.
 *      - orientation {number}: Initial orientation angle (in radians).
 *      - velocity {Vec2}: Initial velocity.
 *      - max_force {number}: Maximum thrust.
 *      - max_speed {number}: Maximum speed.
 *
 * @constructor
 */
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

  /**
   * Adds given force to net_force.
   *
   * @param F
   *    Force to apply.
   */
  apply_force: function(F) {

    this._net_force.add_(F);
  },

  /**
   * Advances the character in time.
   *
   * @details
   *    Uses forward Euler integration to compute new position, velocity. Thereby using
   *    the current value of net_force. Also sets orientation to align with the
   *    new velocity.
   *
   * @param dt
   *    Time (in seconds) to advance.
   */
  step: function(dt) {

    var acceleration;

    truncate(this._net_force, this._max_force);
    acceleration = this._net_force.scale(this._mass_inverse * dt);

    this._velocity.add_(acceleration);
    truncate(this._velocity, this._max_speed);

    this._position.add_(this._velocity.scale(dt));

    if (this._velocity.len2() > 0) {

      this._orientation = RIGHT.signed_angle(this._velocity);
    }
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

},{"../math/Vec2":9}],8:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Behavior = {

  Arrival: require('./behaviors/Arrival'),
  Cohesion: require('./behaviors/Cohesion'),
  Pursuit: require('./behaviors/Pursuit'),
  Seek: require('./behaviors/Seek'),
  Separation: require('./behaviors/Separation'),
  Wander: require('./behaviors/Wander')
};

var Character = require('./core/Character');
var Vec2 = require('./math/Vec2');

var Spatial = {

  NaiveNearestNeighbour: require('./spatial/NaiveNearestNeighbour')
};

var Easing = require('./utility/Easing');
var Predictor = require('./utility/Predictor');

var SB = {

  Behavior: Behavior,

  Character: Character,

  Vec2: Vec2,

  Spatial: Spatial,

  Easing: Easing,
  Predictor: Predictor
};

module.exports = SB;

if (typeof window !== 'undefined') {

  window.SB = SB;
}

},{"./behaviors/Arrival":1,"./behaviors/Cohesion":2,"./behaviors/Pursuit":3,"./behaviors/Seek":4,"./behaviors/Separation":5,"./behaviors/Wander":6,"./core/Character":7,"./math/Vec2":9,"./spatial/NaiveNearestNeighbour":10,"./utility/Easing":11,"./utility/Predictor":12}],9:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * 2D vector.
 *
 * @details
 *    Methods with suffix '_' (underscore) are in-place (mutate the current instance).
 *
 * @param x
 * @param y
 *
 * @constructor
 */
function Vec2(x, y) {

  this._x = x;
  this._y = y;
}

Vec2.prototype = {

  constructor: Vec2,

  add: function(other) {

    return new Vec2(
      this._x + other._x,
      this._y + other._y
    );
  },

  add_: function(other) {

    this._x += other._x;
    this._y += other._y;

    return this;
  },

  sub: function(other) {

    return new Vec2(
      this._x - other._x,
      this._y - other._y
    );
  },

  sub_: function(other) {

    this._x -= other._x;
    this._y -= other._y;

    return this;
  },

  mul: function(other) {

    return new Vec2(
      this._x * other._x,
      this._y * other._y
    );
  },

  mul_: function(other) {

    this._x *= other._x;
    this._y *= other._y;

    return this;
  },

  rotate: function(angle) {

    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    return new Vec2(
      this._x * cos - this._y * sin,
      this._x * sin + this._y * cos
    );
  },

  rotate_: function(angle) {

    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    var x = this._x;
    this._x = x * cos - this._y * sin;
    this._y = x * sin + this._y * cos;

    return this;
  },

  scale: function(scalar) {

    return new Vec2(
      this._x * scalar,
      this._y * scalar
    );
  },

  scale_: function(scalar) {

    this._x *= scalar;
    this._y *= scalar;

    return this;
  },

  len2: function() {

    return this.dot(this);
  },

  len: function() {

    return Math.sqrt(this.len2());
  },

  distance2: function(other) {

    return this.sub(other).len2();
  },

  distance: function(other) {

    return Math.sqrt(this.distance2(other));
  },

  unit: function() {

    var len = this.len();
    len = len > 0 ? len : 1;

    return this.scale(1 / len);
  },

  unit_: function() {

    var len = this.len();
    len = len > 0 ? len : 1;

    return this.scale_(1 / len);
  },

  clone: function() {
    return new Vec2(this._x, this._y);
  },

  copy_: function(other) {

    this._x = other._x;
    this._y = other._y;

    return this;
  },

  dot: function(other) {

    return this._x * other._x + this._y * other._y;
  },

  cross: function(other) {

    return this._x * other._y - this._y * other._x;
  },

  angle: function(other) {

    return Math.acos(this.dot(other) / (this.len() * other.len()));
  },

  signed_angle: function(other) {

    return Math.atan2(this.cross(other), this.dot(other));
  },

  map: function(fn) {

    return new Vec2(
      fn(this._x),
      fn(this._y)
    );
  },

  map_: function(fn) {

    this._x = fn(this._x);
    this._y = fn(this._y);

    return this;
  },

  set: function(x, y) {

    this._x = x;
    this._y = y;

    return this;
  },

  get x() { return this._x; },
  set x(value) { this._x = +value; },

  get y() { return this._y; },
  set y(value) { this._y = +value; },

  toString: function() {

    return 'Vec2(' + this._x + ', ' + this._y + ')';
  }
};


module.exports = Vec2;

},{}],10:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function NaiveNearestNeighbour() {

  this._sites = {};  // id => point mapping
}


NaiveNearestNeighbour.prototype = {

  constructor: NaiveNearestNeighbour,

  set: function(id, p) {

    this._sites[id] = p;
  },

  remove: function(id) {

    delete this._sites[id];
  },

  query_fixed_radius: function(query, radius) {

    var neighbours = [];

    for (var id in this._sites) {

      if (this._sites.hasOwnProperty(id) &&
          this._sites[id].distance(query) <= radius) {

        neighbours.push(id);
      }
    }

    return neighbours;
  }
};


module.exports = NaiveNearestNeighbour;

},{}],11:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


module.exports = {

  linear: function(a, b, t) {

    return a * (1 - t) + b * t;
  }
};

},{}],12:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function extrapolate_linearly(position, velocity, dt) {

  return position.add(velocity.scale(dt));
}


module.exports = {

  constant: function(dt) {

    return function(character) {

      return extrapolate_linearly(character.position, character.velocity, dt);
    };
  },

  distance_based: function(pursuer, scalar) {

    return function(character) {

      var dt = pursuer.position.distance(character.position) * scalar;

      return extrapolate_linearly(character.position, character.velocity, dt);
    };
  }
};

},{}]},{},[8]);
