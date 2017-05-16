/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Behavior =
{
	Arrival: require('./behaviors/Arrival'),
	Cohesion: require('./behaviors/Cohesion'),
	Pursuit: require('./behaviors/Pursuit'),
	Seek: require('./behaviors/Seek'),
	Separation: require('./behaviors/Separation'),
	Wander: require('./behaviors/Wander')
};
const Body = require('./core/Body');
const Vector = require('./math/Vector2');
const Spatial =
{
	NaiveNN: require('./spatial/NaiveNearestNeighbour')
};
const Easing = require('./utility/Easing');
const Predictor = require('./utility/Predictor');

const SB =
{
	Behavior: Behavior,
	Body: Body,
	Vector: Vector,
	Spatial: Spatial,
	Easing: Easing,
	Predictor: Predictor
};


module.exports = SB;

if (window !== undefined)
{
	window.SB = SB;
}
