/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const Behavior =
{
	Arrive: require('./behaviors/Arrive'),
	Pursue: require('./behaviors/Pursue'),
	Seek: require('./behaviors/Seek'),
	Separate: require('./behaviors/Separate'),
	Wander: require('./behaviors/Wander'),
	Patrol: require('./behaviors/Patrol'),
	Align: require('./behaviors/Align')
};
const Vehicle = require('./core/Vehicle');
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
	Vehicle: Vehicle,
	Vector: Vector,
	Spatial: Spatial,
	Easing: Easing,
	Predictor: Predictor
};


module.exports = SB;

if (typeof window !== "undefined")
{
	window.SB = SB;
}
