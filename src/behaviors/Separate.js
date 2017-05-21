/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');

/**
 * Drives a vehicle away from the central position of nearby sites.
 *
 * @param get_repulsion_sites
 *    Callback that evaluates and returns an array of positions that
 *    are considered to be 'nearby'. The callback accepts a single Vector2
 *    argument indicating the driven vehicle's current position.
 * @param repulsion_speed
 *    The desired speed when repulsed.
 * @constructor
 */
function Separate(get_repulsion_sites, repulsion_speed)
{
	this._get_repulsion_sites = get_repulsion_sites;
	this._seek = new SB.Behavior.Seek(new Vector(0, 0), repulsion_speed, true);
}
Separate.prototype =
{
	constructor: Separate,

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
		const sites = this._get_repulsion_sites(vehicle.position);

		if (sites.length === 0)
		{
			return vehicle.velocity.scale(-vehicle.mass / dt);
		}
		else
		{
			const average_position = new Vector(0, 0);
			sites.forEach(site => average_position.add_(site.position));
			average_position.scale(1 / sites.length);

			this._seek.target.assign(average_position);
			return this._seek.drive(vehicle, dt);
		}
	},

	get target() { return this._seek.target;},

	get repulsion_speed() { return this._seek.desired_speed; },
	set repulsion_speed(value) { this._seek.desired_speed = +value; }
};


module.exports = Separate;
