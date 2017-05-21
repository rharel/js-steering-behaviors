/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * Drives the vehicle towards a target position.
 *
 * @param target
 *    The destination.
 * @param desired_speed
 *    The desired cruising speed.
 * @param do_flee
 *    If true, drives the vehicle away from the target instead of towards it
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
		const desired_velocity =
			this._target
				.subtract(vehicle.position)
				.unit_()
				.scale_(this._desired_speed);

		if (this._do_flee)
		{
			desired_velocity.negate_();
		}

		return (
			desired_velocity
				.subtract(vehicle.velocity)
				.scale_(vehicle.mass / dt)
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
