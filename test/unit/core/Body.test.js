/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const expect = require('chai').expect;

const Vector = require('../../../src/math/Vector2');
const Body = require('../../../src/core/Body');


describe ('Body', function() {

  describe ('constructor', function() {

    it ('should have default values when invoked empty', function() {

      const b = new Body();

      expect(b.mass).to.be.equal(1);

      expect(b.position.x).to.be.equal(0);
      expect(b.position.y).to.be.equal(0);

      expect(b.orientation).to.be.equal(0);

      expect(b.velocity.x).to.be.equal(0);
      expect(b.velocity.y).to.be.equal(0);

      expect(b.max_thrust).to.be.equal(1);
      expect(b.max_speed).to.be.equal(1);

      expect(b.net_force.x).to.be.equal(0);
      expect(b.net_force.y).to.be.equal(0);
    });

    it ('should have given values when invoked with object', function() {

      const b = new Body({

        mass: 2,

        position: new Vector(1, 2),
        orientation: 3,

        velocity: new Vector(4, 5),

        max_thrust: 6,
        max_speed: 7
      });

      expect(b.mass).to.be.equal(2);

      expect(b.position.x).to.be.equal(1);
      expect(b.position.y).to.be.equal(2);

      expect(b.orientation).to.be.equal(3);

      expect(b.velocity.x).to.be.equal(4);
      expect(b.velocity.y).to.be.equal(5);

      expect(b.max_thrust).to.be.equal(6);
      expect(b.max_speed).to.be.equal(7);
    });

    it ('should allow for selective property construction', function() {

      const b = new Body({mass: 2, position: new Vector(3, 4)});

      expect(b.mass).to.be.equal(2);

      expect(b.position.x).to.be.equal(3);
      expect(b.position.y).to.be.equal(4);

      expect(b.orientation).to.be.equal(0);

      expect(b.velocity.x).to.be.equal(0);
      expect(b.velocity.y).to.be.equal(0);

      expect(b.max_thrust).to.be.equal(1);
      expect(b.max_speed).to.be.equal(1);

      expect(b.net_force.x).to.be.equal(0);
      expect(b.net_force.y).to.be.equal(0);
    });
  });

  describe ('applying force', function() {

    let b;

    beforeEach(function() {

      b = new Body();
    });

    it ('should add up applied forces', function() {

      b.apply_force(new Vector(1, 2));
      b.apply_force(new Vector(3, 4));

      expect(b.net_force.x).to.be.equal(4);
      expect(b.net_force.y).to.be.equal(6);
    });
  });

  describe ('stepping', function() {

    let b;

    before(function() {

      b = new Body({mass: 0.5, max_thrust: 9, max_speed: 8});
      b.apply_force(new Vector(0, 10));
      b.step(2);
    });

    it ('should update orientation', function() {

      expect(b.orientation).to.be.closeTo(0.5 * Math.PI, 0.001);
    });

    it ('should truncate net force', function() {

      expect(b.net_force.norm()).to.be.equal(9);
    });

    it ('should truncate speed', function() {

      expect(b.velocity.norm()).to.be.equal(8);
    });

    it ('should update velocity', function() {

      expect(b.velocity.x).to.be.equal(0);
      expect(b.velocity.y).to.be.equal(8);
    });

    it ('should update position', function() {

      expect(b.position.x).to.be.equal(0);
      expect(b.position.y).to.be.equal(16);
    });
  });
});
