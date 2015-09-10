/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Behavior = {

  Arrival: require('./behaviors/Arrival'),
  Pursuit: require('./behaviors/Pursuit'),
  Seek: require('./behaviors/Seek'),
  Separation: require('./behaviors/Separation'),
  Wander: require('./behaviors/Wander')
};

var Character = require('./core/Character');
var Vec2 = require('./math/Vec2');

var Spatial = {

  NaiveNearestNeighbour: require('./spatial/NaiveNearestNeighbour')
};

var Easing = require('./utility/Easing');
var Predictor = require('./utility/Predictor');

var SB = {

  Behavior: Behavior,

  Character: Character,

  Vec2: Vec2,

  Spatial: Spatial,

  Easing: Easing,
  Predictor: Predictor
};

module.exports = SB;

if (typeof window !== 'undefined') {

  window.SB = SB;
}
