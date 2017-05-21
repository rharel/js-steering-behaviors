/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * Compute a vehicle's future position given its current position and velocity.
 *
 * @param position
 * 		The vehicle's current position.
 * @param velocity
 * 		The vehicle's static velocity.
 * @param dt
 * 		The amount of time to look into the future.
 * @returns
 * 		The vehicle's position in the future.
 */
function compute_future_position(position, velocity, dt)
{
	return position.add(velocity.scale(dt));
}


module.exports =
{
	/**
	 * Creates a predictor function that approximates a vehicle's future position
	 * based on its current position and velocity (assuming the velocity remains
	 * static), and computing its position a specified amount of time
	 * into the future.
	 *
	 * @param dt
	 * 		The amount of time to look into the future.
	 * @returns
	 * 		A function: vehicle => future position
	 */
	static: function(dt)
	{
		return function(vehicle)
		{
			return compute_future_position
			(
				vehicle.position,
				vehicle.velocity,
				dt
			);
		};
	},
	/**
	 * Creates a predictor function that approximates a vehicle's future position
	 * based on its current position and velocity (assuming the velocity remains
	 * static), and computing its position a dynamic amount of time into the
	 * future. The amount of time to look ahead is retrieved from a specified
	 * function.
	 *
	 * @param get_dt
	 * 		The function which yields the amount of time to look ahead:
	 * 		() => number
	 * @returns {Function}
	 *		A function: vehicle => future position
	 */
	dynamic: function(get_dt)
	{
		return function(vehicle)
		{
			return compute_future_position
			(
				vehicle.position,
				vehicle.velocity,
				get_dt()
			);
		};
	}
};
