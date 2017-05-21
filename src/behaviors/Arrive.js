/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Seek = require('./Seek');
const Easing = require('../utility/Easing');

const EPSILON = 0.001;  // small number


/**
 * Drives a vehicle towards a given target position.
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
function Arrive(
	target,
	desired_speed,
	breaking_distance,
	easing = Easing.linear)
{
	this._desired_speed = desired_speed;
	this._seek = new Seek(target, desired_speed);
	this._breaking_distance = breaking_distance;
	this._ease = easing;
}
Arrive.prototype =
{
	constructor: Arrive,

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
		let distance_to_target =
			vehicle.position.distance_to(this._seek.target);

		if (distance_to_target < EPSILON)
		{
			distance_to_target = 0;
		}
		if (distance_to_target <= this._breaking_distance)
		{
			this._seek.desired_speed = this._ease
			(
				0,
				this._desired_speed,
				distance_to_target / this._breaking_distance
			);
		}
		else
		{
			this._seek.desired_speed = this._desired_speed;
		}

		return this._seek.drive(vehicle, dt);
	},

	get target() { return this._seek.target;},

	get desired_speed() { return this._desired_speed; },
	set desired_speed(value) { this._desired_speed = +value; },

	get breaking_distance() { return this._breaking_distance; },
	set breaking_distance(value) { this._breaking_distance = +value; },

	get ease() { return this._ease; },
	set ease(value) { this._ease = value; }
};


module.exports = Arrive;
