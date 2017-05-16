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
