/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var expect = require('chai').expect;
var Vec2 = require('../../../src/math/Vec2');


describe ('Vec2', function() {

  describe ('constructor', function() {

    var v = new Vec2(0, 1);

    it ('should accept given values', function() {

      expect(v.x).to.be.equal(0);
      expect(v.y).to.be.equal(1);
    });
  });

  describe ('getter/setter', function() {

    var v = new Vec2(0, 0);

    it ('should set values independently', function() {

      v.x = 1;
      v.y = 2;

      expect(v.x).to.be.equal(1);
      expect(v.y).to.be.equal(2);
    });

    it ('should set values together', function() {

      v.set(3, 4);

      expect(v.x).to.be.equal(3);
      expect(v.y).to.be.equal(4);
    });
  });

  function test_binary_operator(name, x1, y1, x2, y2, x3, y3) {

    describe (name, function() {

      var a, b;

      beforeEach(function() {

        a = new Vec2(x1, y1);
        b = new Vec2(x2, y2);
      });

      it ('normal', function() {

        var c = a[name](b);

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
  test_binary_operator('sub', 4, 3, 1, 2, 3, 1);
  test_binary_operator('mul', 2, 3, 4, 5, 8, 15);

  function test_unary_operator(name, x1, y1, arg, x2, y2) {

    describe (name, function() {

      var a;

      beforeEach(function() {

        a = new Vec2(x1, y1);
      });

      it ('normal', function() {

        var c = a[name](arg);

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

  describe ('len', function() {

    var a = new Vec2(3, 4);

    it ('should compute length and length ^ 2', function() {

      expect(a.len2()).to.be.equal(25);
      expect(a.len()).to.be.equal(5);
    });
  });

  describe ('unit', function() {

    var a = new Vec2(1, 2);

    it ('normal', function() {

      var c = a.unit();

      expect(c.len()).to.be.closeTo(1, 0.001);
    });

    it ('in-place', function() {

      a.unit_();

      expect(a.len()).to.be.closeTo(1, 0.001);
    });

    it ('should do nothing for zero vector', function() {

      expect(new Vec2(0, 0).unit().len()).to.be.equal(0);
      expect(new Vec2(0, 0).unit_().len()).to.be.equal(0);
    });
  });

  describe ('clone/copy', function() {

    var a = new Vec2(1, 2);

    it ('normal', function() {

      var c = a.clone();

      expect(c.x).to.be.equal(1);
      expect(c.y).to.be.equal(2);
    });

    it ('in-place', function() {

      a.copy_(new Vec2(3, 4));

      expect(a.x).to.be.equal(3);
      expect(a.y).to.be.equal(4);
    });
  });

  describe ('dot', function() {

    var a = new Vec2(3, 4);
    var b = new Vec2(4, -3);

    it ('should be 0 for orthogonal vectors', function() {

      expect(a.dot(b)).to.be.equal(0);
    });
  });

  describe ('angle', function() {

    var a = new Vec2(3, 0);
    var b = new Vec2(8, 8);

    it ('should be pi/4', function() {

      expect(a.angle(b)).to.be.closeTo(Math.PI / 4, 0.001);
    });
  });

  describe ('distance', function() {

    var a = new Vec2(0, 0);
    var b = new Vec2(3, 4);

    it ('should compute distance and distance ^ 2', function() {

      expect(a.distance2(b)).to.be.equal(25);
      expect(a.distance(b)).to.be.equal(5);
    });
  });
});


