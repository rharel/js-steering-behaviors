/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


module.exports = {

  linear: function(a, b, t) {

    return a * (1 - t) + b * t;
  }
};
