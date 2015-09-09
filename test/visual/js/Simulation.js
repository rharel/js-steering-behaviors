/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function Simulation() {

  this._agents = [];
}


Simulation.prototype = {

  constructor: Simulation,

  step: function(dt) {

    this._agents.forEach(

      function(agent) {

        var character = agent.character;

        character.net_force.set(0, 0);
        character.apply_force(agent.behavior.drive(character));
        character.step(dt)
      }
    );
  },

  get agents() { return this._agents; }
};
