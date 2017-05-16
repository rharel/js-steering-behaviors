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
