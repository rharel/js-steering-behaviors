/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');

/**
 * Drives a vehicle in alignment with nearby vehicles.
 *
 * @param get_neighbourhood_sites
 *    Callback that evaluates and returns an array of velocities of vehicles that
 *    are considered to be 'nearby'. The callback accepts a single Vector2
 *    argument indicating the driven vehicle's current position.
 * @constructor
 */
function Align(get_neighbourhood_sites)
{
	this._get_neighbourhood_sites = get_neighbourhood_sites;
	this._seek = new SB.Behavior.Seek(new Vector(0, 0), 0);
}
Align.prototype =
{
	constructor: Align,

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
		const sites = this._get_neighbourhood_sites(vehicle.position);

		if (sites.length === 0)
		{
			return vehicle.velocity.scale(-vehicle.mass / dt);
		}
		else
		{
			const average_velocity = new Vector(0, 0);
			sites.forEach(site =>
			{
				average_velocity.add_(site.data.velocity);
			});
			average_velocity.scale(1 / sites.length);

			this._seek.target.assign(vehicle.position.add(average_velocity));
			this._seek.desired_speed = average_velocity.norm();
			return this._seek.drive(vehicle, dt);
		}
	},

	get target() { return this._seek.target;},

	get repulsion_speed() { return this._seek.desired_speed; },
	set repulsion_speed(value) { this._seek.desired_speed = +value; }
};


module.exports = Align;
