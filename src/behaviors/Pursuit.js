/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Seek = require('./Seek');
const Predictor = require('../utility/Predictor');

/**
 * Drives the body to pursue another body's position.
 *
 * @param target
 *    The body to pursue.
 * @param desired_speed
 *    The desired cruising speed.
 * @param do_flee
 *    If true, drives the body away from the target instead of towards it
 *    (default is false).
 * @param predictor
 *    Callback used to predict the target's position in the future. It accepts a
 *    single argument that is the target body (default is a static predictor
 *    looking 0.1s into the future).
 * @constructor
 */
function Pursuit(
	target,
	desired_speed,
	do_flee = false,
	predictor = Predictor.static(0.1))
{
	this._target = target;
	this._predict_position = predictor;
	this._seeking_behavior = new Seek(target.position, desired_speed, do_flee);
}
Pursuit.prototype =
{
	constructor: Pursuit,

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
		const target_future_position =
			this._predict_position(this._target);

		this._seeking_behavior.target.assign(target_future_position);

		return this._seeking_behavior.drive(body, dt);
	},

	get target() { return this._target; },
	set target(value) { this._target = value; },

	get desired_speed() { return this._seeking_behavior.desired_speed; },
	set desired_speed(value) { this._seeking_behavior.desired_speed = value; },

	is_fleeing: function() { return this._seeking_behavior.is_fleeing(); },
	flee: function() { this._seeking_behavior.flee(); },
	seek: function() { this._seeking_behavior.seek(); },

	get predictor() { return this._predict_position; },
	set predictor(value) { this._predict_position = value; }
};


module.exports = Pursuit;
