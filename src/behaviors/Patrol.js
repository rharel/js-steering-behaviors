/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');

/**
 * Drives the vehicle along a path.
 *
 * @param checkpoints
 * 		An array of positions.
 * @param desired_speed
 * 		The desired cruising speed.
 * @param breaking_distance
 *      The distance to the target from which to begin breaking.
 * @param do_loop
 * 		True iff the patrol should loop.
 * @constructor
 */
function Patrol
(
	checkpoints,
	desired_speed,
	breaking_distance,
	error_margin = 0.01,
	do_loop = true)
{
	this._checkpoints = checkpoints;
	this._target_index = 0;
	this._arrive = new SB.Behavior.Arrive
	(
		checkpoints[0],
		desired_speed,
		breaking_distance
	);
	this._error_margin = error_margin;
	this._do_loop = do_loop;
}
Patrol.prototype =
{
	constructor: Patrol,

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
		let target = this._arrive.target;
		while (vehicle.position.distance_to(target) < this._error_margin)
		{
			if (this._target_index === this._checkpoints.length - 1)
			{
				if (this._do_loop)
				{
					this._target_index = -1;
				}
				else
				{
					return new Vector(0, 0);
				}
			}
			else
			{
				++ this._target_index;
				target.assign(this._checkpoints[this._target_index]);
			}
		}
		return this._arrive.drive(vehicle, dt);
	},

	get desired_speed() { return this._arrive.desired_speed; },
	set desired_speed(value) { this._arrive.desired_speed = +value; },

	get breaking_distance() { return this._arrive.breaking_distance; },
	set breaking_distance(value) { this.breaking_distance = +value; }
};


module.exports = Patrol;
