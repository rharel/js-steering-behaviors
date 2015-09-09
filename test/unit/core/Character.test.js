/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var expect = require('chai').expect;

var Vec2 = require('../../../src/math/Vec2');
var Character = require('../../../src/core/Character');


describe ('Character', function() {

  describe ('constructor', function() {

    it ('should have default values when invoked empty', function() {

      var c = new Character();

      expect(c.mass).to.be.equal(1);

      expect(c.position.x).to.be.equal(0);
      expect(c.position.y).to.be.equal(0);

      expect(c.orientation).to.be.equal(0);

      expect(c.velocity.x).to.be.equal(0);
      expect(c.velocity.y).to.be.equal(0);

      expect(c.max_force).to.be.equal(1);
      expect(c.max_speed).to.be.equal(1);

      expect(c.net_force.x).to.be.equal(0);
      expect(c.net_force.y).to.be.equal(0);
    });

    it ('should have given values when invoked with object', function() {

      var c = new Character({

        mass: 2,

        position: new Vec2(1, 2),
        orientation: 3,

        velocity: new Vec2(4, 5),

        max_force: 6,
        max_speed: 7
      });

      expect(c.mass).to.be.equal(2);

      expect(c.position.x).to.be.equal(1);
      expect(c.position.y).to.be.equal(2);

      expect(c.orientation).to.be.equal(3);

      expect(c.velocity.x).to.be.equal(4);
      expect(c.velocity.y).to.be.equal(5);

      expect(c.max_force).to.be.equal(6);
      expect(c.max_speed).to.be.equal(7);
    });

    it ('should allow for selective property construction', function() {

      var c = new Character({mass: 2, position: new Vec2(3, 4)});

      expect(c.mass).to.be.equal(2);

      expect(c.position.x).to.be.equal(3);
      expect(c.position.y).to.be.equal(4);

      expect(c.orientation).to.be.equal(0);

      expect(c.velocity.x).to.be.equal(0);
      expect(c.velocity.y).to.be.equal(0);

      expect(c.max_force).to.be.equal(1);
      expect(c.max_speed).to.be.equal(1);

      expect(c.net_force.x).to.be.equal(0);
      expect(c.net_force.y).to.be.equal(0);
    });
  });

  describe ('applying force', function() {

    var c;

    beforeEach(function() {

      c = new Character();
    });

    it ('should add up applied forces', function() {

      c.apply_force(new Vec2(1, 2));
      c.apply_force(new Vec2(3, 4));

      expect(c.net_force.x).to.be.equal(4);
      expect(c.net_force.y).to.be.equal(6);
    });
  });

  describe ('stepping', function() {

    var c;

    before(function() {

      c = new Character({mass: 0.5, max_force: 9, max_speed: 8});
      c.apply_force(new Vec2(0, 10));
      c.step(2);
    });

    it ('should update orientation', function() {

      expect(c.orientation).to.be.closeTo(0.5 * Math.PI, 0.001);
    });

    it ('should truncate net force', function() {

      expect(c.net_force.len()).to.be.equal(9);
    });

    it ('should truncate speed', function() {

      expect(c.velocity.len()).to.be.equal(8);
    });

    it ('should update velocity', function() {

      expect(c.velocity.x).to.be.equal(0);
      expect(c.velocity.y).to.be.equal(8);
    });

    it ('should update position', function() {

      expect(c.position.x).to.be.equal(0);
      expect(c.position.y).to.be.equal(16);
    });
  });
});