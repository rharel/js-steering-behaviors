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
