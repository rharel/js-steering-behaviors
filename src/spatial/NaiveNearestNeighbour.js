/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function NaiveNearestNeighbour() {

  this._sites = {};  // id => point mapping
}


NaiveNearestNeighbour.prototype = {

  constructor: NaiveNearestNeighbour,

  set: function(id, p) {

    this._sites[id] = p;
  },

  remove: function(id) {

    delete this._sites[id];
  },

  query_fixed_radius: function(query, radius) {

    var neighbours = [];

    for (var id in this._sites) {

      if (this._sites.hasOwnProperty(id) &&
          this._sites[id].distance(query) <= radius) {

        neighbours.push(id);
      }
    }

    return neighbours;
  }
};


module.exports = NaiveNearestNeighbour;
