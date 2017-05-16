/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


const expect = require('chai').expect;
const Vector = require('../../../src/math/Vector2');


describe ('Vector2', function() {

  describe ('constructor', function() {

    const v = new Vector(0, 1);

    it ('should accept given values', function() {

      expect(v.x).to.be.equal(0);
      expect(v.y).to.be.equal(1);
    });
  });

  describe ('getter/setter', function() {

    const v = new Vector(0, 0);

    it ('should set_site_position values independently', function() {

      v.x = 1;
      v.y = 2;

      expect(v.x).to.be.equal(1);
      expect(v.y).to.be.equal(2);
    });

    it ('should set_site_position values together', function() {

      v.set(3, 4);

      expect(v.x).to.be.equal(3);
      expect(v.y).to.be.equal(4);
    });
  });

  function test_binary_operator(name, x1, y1, x2, y2, x3, y3) {

    describe (name, function() {

      let a, b;

      beforeEach(function() {

        a = new Vector(x1, y1);
        b = new Vector(x2, y2);
      });

      it ('normal', function() {

        const c = a[name](b);

        expect(c.x).to.be.equal(x3);
        expect(c.y).to.be.equal(y3);
      });

      it ('in-place', function() {

        a[name + '_'](b);

        expect(a.x).to.be.equal(x3);
        expect(a.y).to.be.equal(y3);
      });
    });
  }

  test_binary_operator('add', 0, 1, 2, 3, 2, 4);
  test_binary_operator('subtract', 4, 3, 1, 2, 3, 1);
  test_binary_operator('multiply', 2, 3, 4, 5, 8, 15);

  function test_unary_operator(name, x1, y1, arg, x2, y2) {

    describe (name, function() {

      let a;

      beforeEach(function() {

        a = new Vector(x1, y1);
      });

      it ('normal', function() {

        const c = a[name](arg);

        expect(c.x).to.be.closeTo(x2, 0.001);
        expect(c.y).to.be.closeTo(y2, 0.001);
      });

      it ('in-place', function() {

        a[name + '_'](arg);

        expect(a.x).to.be.closeTo(x2, 0.001);
        expect(a.y).to.be.closeTo(y2, 0.001);
      });
    });
  }

  test_unary_operator('rotate', 0, 1, Math.PI / 2, -1, 0);
  test_unary_operator('scale', 1, 2, 3, 3, 6);
  test_unary_operator('map', 2, 3, function(x) { return x * x; }, 4, 9);

  describe ('norm', function() {

    const a = new Vector(3, 4);

    it ('should compute length and length ^ 2', function() {

      expect(a.squared_norm()).to.be.equal(25);
      expect(a.norm()).to.be.equal(5);
    });
  });

  describe ('negate', function() {

      const a = new Vector(1, 2);

      it ('normal', function() {

        const c = a.negate();

        expect(c.x).to.be.equal(-1);
        expect(c.y).to.be.equal(-2);
      });

      it ('in-place', function() {

        a.negate_();

        expect(a.x).to.be.equal(-1);
        expect(a.y).to.be.equal(-2);
      });
  });

  describe ('unit', function() {

    const a = new Vector(1, 2);

    it ('normal', function() {

      const c = a.unit();

      expect(c.norm()).to.be.closeTo(1, 0.001);
    });

    it ('in-place', function() {

      a.unit_();

      expect(a.norm()).to.be.closeTo(1, 0.001);
    });

    it ('should do nothing for zero vector', function() {

      expect(new Vector(0, 0).unit().norm()).to.be.equal(0);
      expect(new Vector(0, 0).unit_().norm()).to.be.equal(0);
    });
  });

  describe ('clone/copy', function() {

    const a = new Vector(1, 2);

    it ('normal', function() {

      const c = a.clone();

      expect(c.x).to.be.equal(1);
      expect(c.y).to.be.equal(2);
    });

    it ('in-place', function() {

      a.assign(new Vector(3, 4));

      expect(a.x).to.be.equal(3);
      expect(a.y).to.be.equal(4);
    });
  });

  describe ('dot', function() {

    const a = new Vector(3, 4);
    const b = new Vector(4, -3);

    it ('should be 0 for orthogonal vectors', function() {

      expect(a.dot(b)).to.be.equal(0);
    });
  });

  describe ('cross', function() {

    const a = new Vector(1, 0);
    const b = new Vector(0, 2);

    it ('should equal the magnitude of a 3d-cross\' z component', function() {

      expect(a.cross(b)).to.be.equal(2);
    });
  });

  describe ('angle_to', function() {

    const a = new Vector(3, 0);
    const b = new Vector(8, 8);

    it ('should be pi/4', function() {

      expect(a.angle_to(b)).to.be.closeTo(Math.PI / 4, 0.001);
    });
  });

  describe ('signed angle_to', function() {

    const a = new Vector(3, 0);
    const b = new Vector(8, 8);

    it ('should distinguish from positive to negative rotation', function() {

      expect(a.signed_angle_to(b)).to.be.closeTo(Math.PI / 4, 0.001);
      expect(b.signed_angle_to(a)).to.be.closeTo(-Math.PI / 4, 0.001);
    });
  });

  describe ('distance_to', function() {

    const a = new Vector(0, 0);
    const b = new Vector(3, 4);

    it ('should compute distance_to and distance_to ^ 2', function() {

      expect(a.squared_distance_to(b)).to.be.equal(25);
      expect(a.distance_to(b)).to.be.equal(5);
    });
  });
});
