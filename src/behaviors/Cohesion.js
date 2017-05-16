/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Vector = require('../math/Vector2');

/**
 * Drives a body closer to the central position of nearby characters.
 *
 * @param get_nearest_neighbours
 *    Callback that evaluates and returns an array of position of bodies that
 *    are considered to be 'nearby'. The callback accepts a single Vector2
 *    argument indicating the driven body's current position.
 *
 * @param get_attraction_weight
 *    Callback that controls the scaling of the attracting force. The callback
 *    accepts a single scalar argument indicating the distance_to between the
 *    driven body and the central attraction point.
 *
 * @constructor
 */
function Cohesion(get_nearest_neighbours, get_attraction_weight)
{
	this._get_nearest_neighbours = get_nearest_neighbours;
	this._get_attraction_weight = get_attraction_weight;
}
Cohesion.prototype =
{
	constructor: Cohesion,

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
		const average_position = new Vector(0, 0);
		const neighbour_positions = this._get_nearest_neighbours(body.position);

		if (neighbour_positions.length === 1)
		{
			return body.velocity.scale(-body.mass / dt);
		}
		else
		{
			neighbour_positions.forEach(position =>
			{
				average_position.add_(position);
			});
			average_position.scale_(1 / neighbour_positions.length);

			const D = body.position.distance_to(average_position);
			const W = this._get_attraction_weight(D);

			return (
				average_position
					.subtract(body.position)
					.scale_(W)
			);
		}
	}
};


module.exports = Cohesion;
