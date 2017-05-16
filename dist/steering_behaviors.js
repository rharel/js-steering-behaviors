(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Seek = require('./Seek');
const Easing = require('../utility/Easing');
const Vector = require('../math/Vector2');

const EPSILON = 0.001;  // small number


/**
 * Drives a body towards a given target position.
 *
 * @details
 *    Up until a given distance D from the target, this behavior is identical
 *    to Seek. When the character is <= D units away from the target, it will
 *    begin slowing down to a standstill.
 * @param target
 *    The target position.
 * @param desired_speed
 *    The cruising speed when outside of breaking radius.
 * @param breaking_distance
 *    The distance to the target from which to begin breaking.
 * @param easing
 *    The easing function applied to the character's velocity once inside the
 *    breaking radius (default is Easing.linear).
 * @constructor
 */
function Arrival(
	target,
	desired_speed,
	breaking_distance,
	easing = Easing.linear)
{
	this._desired_speed = desired_speed;
	this._seeking_behavior = new Seek(target, desired_speed);
	this._breaking_distance = breaking_distance;
	this._ease = easing;
}
Arrival.prototype =
{
	constructor: Arrival,

	/**
	 * Drives the specified body for the specified amount of time.
	 *
	 * @param body
	 * 		The body to drive.
	 * @param dt
	 * 		The drive's duration.
	 * @returns
	 * 		The desired force to be applied to the body.
	 */
	drive: function(body, dt = 1)
	{
		let distance_to_target =
			body.position.distance_to(this._seeking_behavior.target);

		if (distance_to_target < EPSILON)
		{
			distance_to_target = 0;
		}
		if (distance_to_target <= this._breaking_distance)
		{
			this._seeking_behavior.desired_speed = this._ease
			(
				0,
				this._desired_speed,
				distance_to_target / this._breaking_distance
			);
		}
		else
		{
			this._seeking_behavior.desired_speed = this._desired_speed;
		}

		return this._seeking_behavior.drive(body, dt);
	},

	get target() { return this._seeking_behavior.target;},

	get desired_speed() { return this._desired_speed; },
	set desired_speed(value) { this._desired_speed = +value; },

	get breaking_distance() { return this._breaking_distance; },
	set breaking_distance(value) { this._breaking_distance = +value; }
};


module.exports = Arrival;

},{"../math/Vector2":9,"../utility/Easing":11,"./Seek":4}],2:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');

/**
 * Drives a body closer to the central position of nearby characters.
 *
 * @param get_nearest_neighbours
 *    Callback that evaluates and returns an array of position of bodies that
 *    are considered to be 'nearby'. The callback accepts a single Vector2
 *    argument indicating the driven body's current position.
 *
 * @param get_attraction_weight
 *    Callback that controls the scaling of the attracting force. The callback
 *    accepts a single scalar argument indicating the distance_to between the
 *    driven body and the central attraction point.
 *
 * @constructor
 */
function Cohesion(get_nearest_neighbours, get_attraction_weight)
{
	this._get_nearest_neighbours = get_nearest_neighbours;
	this._get_attraction_weight = get_attraction_weight;
}
Cohesion.prototype =
{
	constructor: Cohesion,

	/**
	 * Drives the specified body for the specified amount of time.
	 *
	 * @param body
	 * 		The body to drive.
	 * @param dt
	 * 		The drive's duration.
	 * @returns
	 * 		The desired force to be applied to the body.
	 */
	drive: function(body, dt = 1)
	{
		const average_position = new Vector(0, 0);
		const neighbour_positions = this._get_nearest_neighbours(body.position);

		if (neighbour_positions.length === 1)
		{
			return body.velocity.scale(-body.mass / dt);
		}
		else
		{
			neighbour_positions.forEach(position =>
			{
				average_position.add_(position);
			});
			average_position.scale_(1 / neighbour_positions.length);

			const D = body.position.distance_to(average_position);
			const W = this._get_attraction_weight(D);

			return (
				average_position
					.subtract(body.position)
					.scale_(W)
			);
		}
	}
};


module.exports = Cohesion;

},{"../math/Vector2":9}],3:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Seek = require('./Seek');
const Predictor = require('../utility/Predictor');

/**
 * Drives the body to pursue another body's position.
 *
 * @param target
 *    The body to pursue.
 * @param desired_speed
 *    The desired cruising speed.
 * @param do_flee
 *    If true, drives the body away from the target instead of towards it
 *    (default is false).
 * @param predictor
 *    Callback used to predict the target's position in the future. It accepts a
 *    single argument that is the target body (default is a static predictor
 *    looking 0.1s into the future).
 * @constructor
 */
function Pursuit(
	target,
	desired_speed,
	do_flee = false,
	predictor = Predictor.static(0.1))
{
	this._target = target;
	this._predict_position = predictor;
	this._seeking_behavior = new Seek(target.position, desired_speed, do_flee);
}
Pursuit.prototype =
{
	constructor: Pursuit,

	/**
	 * Drives the specified body for the specified amount of time.
	 *
	 * @param body
	 * 		The body to drive.
	 * @param dt
	 * 		The drive's duration.
	 * @returns
	 * 		The desired force to be applied to the body.
	 */
	drive: function(body, dt = 1)
	{
		const target_future_position =
			this._predict_position(this._target);

		this._seeking_behavior.target.assign(target_future_position);

		return this._seeking_behavior.drive(body, dt);
	},

	get target() { return this._target; },
	set target(value) { this._target = value; },

	get desired_speed() { return this._seeking_behavior.desired_speed; },
	set desired_speed(value) { this._seeking_behavior.desired_speed = value; },

	is_fleeing: function() { return this._seeking_behavior.is_fleeing(); },
	flee: function() { this._seeking_behavior.flee(); },
	seek: function() { this._seeking_behavior.seek(); },

	get predictor() { return this._predict_position; },
	set predictor(value) { this._predict_position = value; }
};


module.exports = Pursuit;

},{"../utility/Predictor":12,"./Seek":4}],4:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * Drives the body towards a target position.
 *
 * @param target
 *    The destination.
 * @param desired_speed
 *    The desired cruising speed.
 * @param do_flee
 *    If true, drives the body away from the target instead of towards it
 *    (default is false).
 * @constructor
 */
function Seek(target, desired_speed, do_flee = false)
{
	this._target = target.clone();
	this._desired_speed = desired_speed;
	this._do_flee = do_flee;
}
Seek.prototype =
{
	constructor: Seek,

	/**
	 * Drives the specified body for the specified amount of time.
	 *
	 * @param body
	 * 		The body to drive.
	 * @param dt
	 * 		The drive's duration.
	 * @returns
	 * 		The desired force to be applied to the body.
	 */
	drive: function(body, dt = 1)
	{
		const desired_velocity =
			this._target
				.subtract(body.position)
				.unit_()
				.scale_(this._desired_speed);

		if (this._do_flee)
		{
			desired_velocity.negate_();
		}

		return (
			desired_velocity
				.subtract(body.velocity)
				.scale_(body.mass / dt)
		);
	},

	get target() { return this._target; },

	get desired_speed() { return this._desired_speed; },
	set desired_speed(value) { this._desired_speed = +value; },

	is_fleeing: function() { return this._do_flee; },
	flee: function() { this._do_flee = true; },
	seek: function() { this._do_flee = false; },
};


module.exports = Seek;

},{}],5:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');

/**
 * Drives a body away from the central position of nearby characters.
 *
 * @param get_nearest_neighbours
 *    Callback that evaluates and returns an array of positions of bodies that
 *    are considered to be 'nearby'. The callback accepts a single Vector2
 *    argument indicating the driven body's current position.
 *
 * @param get_repulsion_weight
 *    Callback that controls the scaling of the repulsive force. The callback
 *    accepts a single scalar argument indicating the distance between the
 *    driven body and the repulsion point.
 *
 * @constructor
 */
function Separation(get_nearest_neighbours, get_repulsion_weight)
{
	this._get_nearest_neighbours = get_nearest_neighbours;
	this._get_repulsion_weight = get_repulsion_weight;
}
Separation.prototype =
{
	constructor: Separation,

	/**
	 * Drives the specified body for the specified amount of time.
	 *
	 * @param body
	 * 		The body to drive.
	 * @param dt
	 * 		The drive's duration.
	 * @returns
	 * 		The desired force to be applied to the body.
	 */
	drive: function(body, dt = 1)
	{
		const neighbour_positions = this._get_nearest_neighbours(body.position);

		if (neighbour_positions.length === 1)
		{
			return body.velocity.scale(-body.mass / dt);
		}
		else
		{
			const total_force = new Vector(0, 0);
			neighbour_positions.forEach(neighbour_position =>
			{
				const D = body.position.distance_to(neighbour_position);
				const W = this._get_repulsion_weight(D);
				const repulsive_force =
					body.position
						.subtract(neighbour_position)
						.unit_()
						.scale_(W);

				total_force.add_(repulsive_force);
			});
			return total_force;
		}
	}
};


module.exports = Separation;

},{"../math/Vector2":9}],6:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');

/**
 * Drives the body in random directions.
 *
 * @param max_turn_angle
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
function Wander(max_turn_angle, max_turn_rate, speed)
{
	this._max_turn_angle = Math.abs(max_turn_angle);
	this._max_turn_rate = Math.abs(max_turn_rate);
	this._speed = speed;

	this._current_angle = 0;
}
Wander.prototype =
{
	constructor: Wander,

	/**
	 * Drives the specified body for the specified amount of time.
	 *
	 * @param body
	 * 		The body to drive.
	 * @param dt
	 * 		The drive's duration.
	 * @returns
	 * 		The desired force to be applied to the body.
	 */
	drive: function(body, dt = 1)
	{
		this._current_angle += random_in_range
		(
	    	-this._max_turn_rate,
	    	 this._max_turn_rate
		);
		this._current_angle = Math.min
		(
			this._max_turn_angle,
			Math.max(-this._max_turn_angle, this._current_angle)
		);

		let force;
		force = Vector.X.rotate(body.orientation + this._current_angle);
		force.scale_(this._speed * body.mass / dt);

		return force;
	},

	get max_turn_angle() { return this._max_turn_angle; },
	set max_turn_angle(value) { this._max_turn_angle = Math.abs(+value); },

	get max_turn_rate() { return this._max_turn_rate; },
	set max_turn_rate(value) { this._max_turn_rate = Math.abs(+value); },

	get speed() { return this._speed; },
	set speed(value) { this._speed = +value; }
};

/**
 * Generates a random number in the specified range.
 *
 * @param min
 * 		The range's lower bound.
 * @param max
 * 		The range's upper bound.s
 * @returns
 * 		A random number in the specified range.
 */
function random_in_range(min, max)
{
	return min + (max - min) * Math.random();
}


module.exports = Wander;

},{"../math/Vector2":9}],7:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');


/**
 * A body's default properties.
 */
const DEFAULT_PROPERTIES =
{
	mass: 1,

	position: new Vector(0, 0),
	orientation: 0,

	velocity: new Vector(0, 0),

	max_thrust: 1,
	max_speed: 1
};
/**
 * Represents a point-mass body capable of thrust.
 *
 * @constructor
 * @param user_properties
 *    An object describing the body's properties and initial state,
 *    contains the following keys:
 *      - mass {number}: Body mass.
 *      - position {Vector2}: Initial position.
 *      - orientation {number}: Initial orientation angle_to (in radians).
 *      - velocity {Vector2}: Initial velocity.
 *      - max_thrust {number}: Maximum thrust.
 *      - max_speed {number}: Maximum speed.
 */
function Body(user_properties = DEFAULT_PROPERTIES)
{
	const properties = Object.assign({}, DEFAULT_PROPERTIES, user_properties);

	this._mass = properties.mass;
	this._mass_inverse = 1 / this._mass;

	this._position = properties.position.clone();
	this._orientation = properties.orientation;

	this._velocity = properties.velocity.clone();

	this._max_thrust = properties.max_thrust;
	this._max_speed = properties.max_speed;

	this._net_force = new Vector(0, 0);
}
Body.prototype =
{
	constructor: Body,

	/**
	* Applies the specified force vector to the body.
	*
	* @param F
	*    Force to apply.
	*/
	apply_force: function(F)
	{
		this._net_force.add_(F);
	},

	/**
	* Advances the body in time.
	*
	* @details
	*    Uses forward Euler integration to compute new position and velocity.
	*    Also sets orientation to align with the new velocity's direction.
	*
	* @param dt
	*    The time duration to advance.
	*/
	step: function(dt)
	{
		truncate(this._net_force, this._max_thrust);
		const acceleration = this._net_force.scale(this._mass_inverse * dt);

		this._velocity.add_(acceleration);
		truncate(this._velocity, this._max_speed);

		this._position.add_(this._velocity.scale(dt));

		if (this._velocity.squared_norm() > 0)
		{
			this._orientation = Vector.X.signed_angle_to(this._velocity);
		}
	},

	get position() { return this._position; },
	get orientation() { return this._orientation; },
	get velocity() { return this._velocity; },
	get net_force() { return this._net_force; },

	get mass() { return this._mass; },
	set mass(value)
	{
		this._mass = +value;
		this._mass_inverse = 1 / this._mass;
	},

	get max_thrust() { return this._max_thrust;},
	set max_thrust(value) { this._max_thrust = +value; },

	get max_speed() { return this._max_speed; },
	set max_speed(value) { this._max_speed = +value; }
};

/**
 * Performs magnitude truncation on a vector.
 * @param v
 * 		The vector to truncate.
 * @param bound
 * 		The bounding value.
 * @returns
 * 		The truncated vector.
 */
function truncate(v, bound)
{
	const norm = v.norm();
	if (norm > bound)
	{
		v.scale_(bound / norm);
	}

	return v;
}


module.exports = Body;

},{"../math/Vector2":9}],8:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Behavior =
{
	Arrival: require('./behaviors/Arrival'),
	Cohesion: require('./behaviors/Cohesion'),
	Pursuit: require('./behaviors/Pursuit'),
	Seek: require('./behaviors/Seek'),
	Separation: require('./behaviors/Separation'),
	Wander: require('./behaviors/Wander')
};
const Body = require('./core/Body');
const Vector = require('./math/Vector2');
const Spatial =
{
	NaiveNN: require('./spatial/NaiveNearestNeighbour')
};
const Easing = require('./utility/Easing');
const Predictor = require('./utility/Predictor');

const SB =
{
	Behavior: Behavior,
	Body: Body,
	Vector: Vector,
	Spatial: Spatial,
	Easing: Easing,
	Predictor: Predictor
};


module.exports = SB;

if (window !== undefined)
{
	window.SB = SB;
}

},{"./behaviors/Arrival":1,"./behaviors/Cohesion":2,"./behaviors/Pursuit":3,"./behaviors/Seek":4,"./behaviors/Separation":5,"./behaviors/Wander":6,"./core/Body":7,"./math/Vector2":9,"./spatial/NaiveNearestNeighbour":10,"./utility/Easing":11,"./utility/Predictor":12}],9:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * Represents a two-dimensional vector.
 *
 * @constructor
 * @param x
 * 		The vector's first coordinate.
 * @param y
 *		The vector's second coordinate.
 * @note
 *    Methods with suffix '_' (underscore) denote an in-place operation.
 */
function Vector2(x, y)
{
	this._x = x;
	this._y = y;
}
Vector2.prototype =
{
	constructor: Vector2,

	/**
	 * Performs negation.
	 */
	negate: function()
	{
		return this.scale(-1);
	},
	/**
	 * Performs negation (in-place).
	 */
	negate_: function()
	{
		return this.scale_(-1);
	},

	/**
	 * Performs element-wise addition.
	 */
	add: function(other)
	{
		return new Vector2
		(
			this._x + other._x,
			this._y + other._y
		);
	},
	/**
	 * Performs element-wise addition (in-place).
	 */
	add_: function(other)
	{
		this._x += other._x;
		this._y += other._y;

		return this;
	},

	/**
	 * Performs element-wise subtraction.
	 */
	subtract: function(other)
	{
		return new Vector2
		(
			this._x - other._x,
			this._y - other._y
		);
	},
	/**
	 * Performs element-wise subtraction (in-place).
	 */
	subtract_: function(other)
	{
		this._x -= other._x;
		this._y -= other._y;

		return this;
	},

	/**
	 * Performs element-wise multiplication.
	 */
	multiply: function(other)
	{
		return new Vector2
		(
	    	this._x * other._x,
	  		this._y * other._y
		);
	},
	/**
	 * Performs element-wise multiplication (in-place).
	 */
	multiply_: function(other)
	{
		this._x *= other._x;
		this._y *= other._y;

		return this;
	},

	/**
	 * Performs rotation by an angle_to.
	 *
	 * @param angle
	 * 		Angle of rotation (in radians).
	 */
	rotate: function(angle)
	{
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		return new Vector2
		(
	  		this._x * cos - this._y * sin,
	  		this._x * sin + this._y * cos
		);
	},
	/**
	 * Performs rotation by an angle_to (in-place).
	 *
	 * @param angle
	 * 		Angle of rotation (in radians).
	 */
	rotate_: function(angle)
	{
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		const x = this._x;
		this._x = x * cos - this._y * sin;
		this._y = x * sin + this._y * cos;

		return this;
	},

	/**
	 * Performs scaling.
	 */
	scale: function(scalar)
	{
		return new Vector2
		(
			this._x * scalar,
	  		this._y * scalar
		);
	},
	/**
	 * Performs scaling (in-place).
	 */
	scale_: function(scalar)
	{
		this._x *= scalar;
		this._y *= scalar;

		return this;
	},

	/**
	 * Computes the squared norm.
	 */
	squared_norm: function()
	{
		return this.dot(this);
	},
	/**
	 * Computes the norm.
	 */
	norm: function()
	{
		return Math.sqrt(this.squared_norm());
	},

	/**
	 * Computes the squared distance between vectors.
	 */
	squared_distance_to: function(other)
	{
		return this.subtract(other).squared_norm();
	},
	/**
	 * Computes the distance between vectors.
	 */
	distance_to: function(other)
	{
		return Math.sqrt(this.squared_distance_to(other));
	},

	/**
	 * Performs normalization.
	 */
	unit: function()
	{
		const n = this.norm();
		return (
			n === 0 ?
			this.clone() :
			this.scale(1 / n)
		);
	},
	/**
	 * Performs normalization (in-place).
	 */
	unit_: function()
	{
		const n = this.norm();
		return (
			n === 0 ?
			this :
			this.scale_(1 / n)
		);
	},

	/**
	 * Produces a clone of this.
	 */
	clone: function()
	{
		return new Vector2(this._x, this._y);
	},
	/**
	 * Assigns the values of another to this (in-place).
	 */
	assign: function(other)
	{
		this._x = other._x;
		this._y = other._y;

		return this;
	},

	/**
	 * Performs the dot product.
	 */
	dot: function(other)
	{
		return this._x * other._x +
			   this._y * other._y;
	},
	/**
	 * Performs the cross product.
	 */
	cross: function(other)
	{
		return this._x * other._y -
			   this._y * other._x;
	},

	/**
	 * Computes the angle_to between two vectors.
	 */
	angle_to: function(other)
	{
		return Math.acos
		(
			this.dot(other) /
			(this.norm() * other.norm())
		);
	},
	/**
	 * Computes the signed angle_to between two vectors.
	 */
	signed_angle_to: function(other)
	{
		return Math.atan2
		(
			this.cross(other),
			this.dot(other)
		);
	},

	/**
	 * Performs element-wise mapping.
	 *
	 * @param f
	 * 		The mapping function.
	 */
	map: function(f)
	{
		return new Vector2
		(
	    	f(this._x),
			f(this._y)
		);
	},
	/**
	 * Performs element-wise mapping (in-place).
	 *
	 * @param f
	 * 		The mapping function.
	 */
	map_: function(f)
	{
		this._x = f(this._x);
		this._y = f(this._y);

		return this;
	},

	/**
	 * Sets coordinate values for this (in-place).
	 */
	set: function(x, y)
	{
		this._x = x;
		this._y = y;

		return this;
	},

	get x() { return this._x; },
	set x(value) { this._x = +value; },

	get y() { return this._y; },
	set y(value) { this._y = +value; },

	toString: function()
	{
		return `Vector2(${this._x}, ${this._y})`;
	}
};

Vector2.ZERO = new Vector2(0, 0);
Vector2.X = new Vector2(1, 0);
Vector2.Y = new Vector2(0, 1);


module.exports = Vector2;

},{}],10:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * A naive data structure for nearest-neighbour queries.
 *
 * @constructor
 */
function NaiveNearestNeighbour()
{
	this._sites = {};  // Mapping: id => position
}
NaiveNearestNeighbour.prototype =
{
	constructor: NaiveNearestNeighbour,

	/**
	 * Sets a site's position.
	 *
	 * @param id
	 * 		The site's ID.
	 * @param position
	 * 		The site's position.
	 */
	set_site_position: function(id, position)
	{
		this._sites[id] = position;
	},
	/**
	 * Removes a site from the index.
	 *
	 * @param id
	 * 		The site's ID.
	 */
	remove_site: function(id)
	{
		delete this._sites[id];
	},

	/**
	 * Compute all sites that are within the specified distance_to from a specified
	 * query position.
	 *
	 * @param position
	 * 		The query position.
	 * @param radius
	 * 		The radius of the query.
	 * @returns
	 * 		An array of site IDs.
	 */
	get_nearest_in_radius: function(position, radius)
	{
		let positions = [];

		for (const id in this._sites)
		{
			if (this._sites.hasOwnProperty(id) &&
			    this._sites[id].distance_to(position) <= radius)
			{
				positions.push(this._sites[id]);
			}
		}
		return positions;
	}
};


module.exports = NaiveNearestNeighbour;

},{}],11:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


module.exports =
{
	/**
	 * Computes the linear interpolation between two numbers at the specified
	 * time.
	 *
	 * @param a
	 * 		The first number.
	 * @param b
	 * 		The second number.
	 * @param t
	 * 		The time (0 <= t <= 1).
	 * @returns
	 * 		The interpolated value between the two numbers at the specified
	 * 		time.
	 */
	linear: function(a, b, t)
	{
		return a * (1 - t) + b * t;
	}
};

},{}],12:[function(require,module,exports){
/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * Compute a body's future position given its current position and velocity.
 *
 * @param position
 * 		The body's current position.
 * @param velocity
 * 		The body's static velocity.
 * @param dt
 * 		The amount of time to look into the future.
 * @returns
 * 		The body's position in the future.
 */
function compute_future_position(position, velocity, dt)
{
	return position.add(velocity.scale(dt));
}


module.exports =
{
	/**
	 * Creates a predictor function that approximates a body's future position
	 * based on its current position and velocity (assuming the velocity remains
	 * static), and computing its position a specified amount of time
	 * into the future.
	 *
	 * @param dt
	 * 		The amount of time to look into the future.
	 * @returns
	 * 		A function: body => future position
	 */
	static: function(dt)
	{
		return function(body)
		{
			return compute_future_position
			(
				body.position,
				body.velocity,
				dt
			);
		};
	},
	/**
	 * Creates a predictor function that approximates a body's future position
	 * based on its current position and velocity (assuming the velocity remains
	 * static), and computing its position a dynamic amount of time into the
	 * future. The amount of time to look ahead is retrieved from a specified
	 * function.
	 *
	 * @param get_dt
	 * 		The function which yields the amount of time to look ahead:
	 * 		() => number
	 * @returns {Function}
	 *		A function: body => future position
	 */
	dynamic: function(get_dt)
	{
		return function(body)
		{
			return compute_future_position
			(
				body.position,
				body.velocity,
				get_dt()
			);
		};
	}
};

},{}]},{},[8]);
