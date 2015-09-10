/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function Player(fps, callback) {

  this._interval = 1000 / fps;
  this._callback = callback;
  this._playing = false;
}


Player.prototype = {

  constructor: Player,

  step: function() {

    this._callback();

    if (this._playing) {

      setTimeout(this.step.bind(this), this._interval);
    }
  },

  play: function() {

    if (this._playing) { return; }

    this._playing = true;
    this.step();
  },

  pause: function() {

    this._playing = false;
  }
};
