/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');


/**
 * A vehicle's default properties.
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
 * Represents a point-mass vehicle capable of thrust.
 *
 * @constructor
 * @param user_properties
 *    An object describing the vehicle's properties and initial state,
 *    may contain any of the following keys:
 *      - mass {number}: Vehicle mass.
 *      - position {Vector2}: Initial position.
 *      - orientation {number}: Initial orientation angle (in radians).
 *      - velocity {Vector2}: Initial velocity.
 *      - max_thrust {number}: Maximum thrust.
 *      - max_speed {number}: Maximum speed.
 */
function Vehicle(user_properties = DEFAULT_PROPERTIES)
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
Vehicle.prototype =
{
	constructor: Vehicle,

	/**
	* Applies the specified force vector to the vehicle.
	*
	* @param F
	*    Force to apply.
	*/
	apply_force: function(F)
	{
		this._net_force.add_(F);
	},

	/**
	* Advances the vehicle in time.
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
		const acceleration = this._net_force.scale(this._mass_inverse);

		this._velocity.add_(acceleration.scale(dt));
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
 * @param upper_bound
 * 		The bounding value.
 * @returns
 * 		The truncated vector.
 */
function truncate(v, upper_bound)
{
	const norm = v.norm();
	if (norm > upper_bound)
	{
		v.scale_(upper_bound / norm);
	}

	return v;
}


module.exports = Vehicle;
