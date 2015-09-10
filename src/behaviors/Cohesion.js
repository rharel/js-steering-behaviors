/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var Vec2 = require('../math/Vec2');


function Cohesion(nearest_neighbours, attraction_weight) {

  this._nearest_neighbours = nearest_neighbours;
  this._attraction_weight = attraction_weight;
}


Cohesion.prototype = {

  constructor: Cohesion,

  drive: function(character, dt) {

    dt = dt || 1;

    var average_position = new Vec2(0, 0);

    var neighbours = this._nearest_neighbours(character.position);

    if (neighbours.length === 1) {

      return character.velocity.scale(-character.mass / dt);
    }

    else {

      neighbours.forEach(

        function(neighbour) { average_position.add_(neighbour.position); }
      );

      average_position.scale_(1 / neighbours.length);

      return average_position
        .sub(character.position)
        .scale_(this._attraction_weight(
          character.position.distance(average_position)
        ));
    }
  }
};


module.exports = Cohesion;