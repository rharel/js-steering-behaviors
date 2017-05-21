/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');

/**
 * Drives the vehicle in random directions.
 *
 * @param max_turn_rate
 *    Maximum change in turn angle from update to update.
 * @param max_turn_rate_change
 *    Maximum change in the turn rate from update to update.
 * @param speed
 *    Desired cruising speed.
 *
 * @constructor
 */
function Wander(max_turn_rate, max_turn_rate_change, speed)
{
	this._max_turn_rate = Math.abs(max_turn_rate);
	this._max_turn_rate_change = Math.abs(max_turn_rate_change);
	this._speed = speed;

	this._current_turn_rate = 0;
}
Wander.prototype =
{
	constructor: Wander,

	/**
	 * Drives the specified vehicle for the specified amount of time.
	 *
	 * @param vehicle
	 * 		The vehicle to drive.
	 * @param dt
	 * 		The drive's duration.
	 * @returns
	 * 		The desired force to be applied to the vehicle.
	 */
	drive: function(vehicle, dt = 1)
	{
		this._current_turn_rate += random_in_range
		(
			-this._max_turn_rate_change,
			this._max_turn_rate_change
		);
		this._current_turn_rate = Math.min
		(
			this._max_turn_rate,
			Math.max(-this._max_turn_rate, this._current_turn_rate)
		);
		const desired_velocity =
			Vector.X
				.rotate(vehicle.orientation + this._current_turn_rate)
				.scale_(this._speed);
		return (
			desired_velocity
				.subtract(vehicle.velocity)
				.scale_(vehicle.mass / dt)
		);
	},

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
