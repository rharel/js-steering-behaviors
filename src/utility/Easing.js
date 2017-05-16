/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


module.exports =
{
	/**
	 * Computes the linear interpolation between two numbers at the specified
	 * time.
	 *
	 * @param a
	 * 		The first number.
	 * @param b
	 * 		The second number.
	 * @param t
	 * 		The time (0 <= t <= 1).
	 * @returns
	 * 		The interpolated value between the two numbers at the specified
	 * 		time.
	 */
	linear: function(a, b, t)
	{
		return a * (1 - t) + b * t;
	}
};
