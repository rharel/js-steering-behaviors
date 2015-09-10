/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Vec2 = require('../math/Vec2');


function Separation(nearest_neighbours, repulsion_weight) {

  this._nearest_neighbours = nearest_neighbours;
  this._repulsion_weight = repulsion_weight;
}


Separation.prototype = {

  constructor: Separation,

  drive: function(character, dt) {

    var neighbours = this._nearest_neighbours(character.position);

    if (neighbours.length === 1) {

      return character.velocity.scale(-character.mass / dt);
    }

    else {

      var total_force = new Vec2(0, 0);

      neighbours.forEach(

        function(neighbour) {

          var repulsive_force =
            character.position
              .sub(neighbour.position)
              .unit_()
              .scale_(this._repulsion_weight(character.position.distance(neighbour.position)));

          total_force.add_(repulsive_force);
        },
        this
      );

      return total_force;
    }
  }
};


module.exports = Separation;
