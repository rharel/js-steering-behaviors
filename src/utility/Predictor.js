/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function extrapolate_linearly(position, velocity, dt) {

  return position.add(velocity.scale(dt));
}


module.exports = {

  constant: function(dt) {

    return function(character) {

      return extrapolate_linearly(character.position, character.velocity, dt);
    };
  },

  distance_based: function(pursuer, scalar) {

    return function(character) {

      var dt = pursuer.position.distance(character.position) * scalar;

      return extrapolate_linearly(character.position, character.velocity, dt);
    };
  }
};
