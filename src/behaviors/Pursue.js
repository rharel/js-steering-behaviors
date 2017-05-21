/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Seek = require('./Seek');
const Predictor = require('../utility/Predictor');

/**
 * Drives the vehicle to seek a dynamic position.
 *
 * @param get_target
 *    Callback yielding the target position to seek.
 * @param desired_speed
 *    The desired cruising speed.
 * @param do_evade
 *    If true, drives the vehicle away from the target instead of towards it
 *    (default is false).
 * @constructor
 */
function Pursue(get_target, desired_speed, do_evade = false)
{
	this._get_target = get_target;
	this._seek = new Seek(new SB.Vector(0, 0), desired_speed, do_evade);
}
/**
 * Drives the vehicle to intercept another vehicle.
 *
 * @param target
 * 		The vehicle to pursue.
 * @param desired_speed
 * 		The desired cruising speed.
 * @param predict_position
 * 		A function which takes in a vehicle and outputs an approximation of its
 * 		future position (default is linear extrapolation).
 * @param do_evade
 * 		If true, drives the vehicle away from the target instead of towards it
 * 		(default is false).
 * @returns {Pursue}
 */
Pursue.vehicle = function(
	target,
	desired_speed,
	predict_position = Predictor.static(0.1),
	do_evade = false)
{
	return new Pursue(
		() => predict_position(target),
		desired_speed,
		do_evade
	);
};
Pursue.prototype =
{
	constructor: Pursue,

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
		this._seek.target.assign(this._get_target());

		return this._seek.drive(vehicle, dt);
	},

	get get_target() { return this._get_target; },
	set get_target(value) { this._get_target = value; },

	get target() { return this._seek.target; },
	set target(value) { this._seek.target.assign(value); },

	get desired_speed() { return this._seek.desired_speed; },
	set desired_speed(value) { this._seek.desired_speed = value; },

	is_evading: function() { return this._seek.is_fleeing(); },
	evade: function() { this._seek.flee(); },
	pursue: function() { this._seek.seek(); },
};


module.exports = Pursue;
