/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function Vec2(x, y) {

  this._x = x;
  this._y = y;
}

Vec2.prototype = {

  constructor: Vec2,

  add: function(other) {

    return new Vec2(
      this._x + other._x,
      this._y + other._y
    );
  },

  add_: function(other) {

    this._x += other._x;
    this._y += other._y;

    return this;
  },

  sub: function(other) {

    return new Vec2(
      this._x - other._x,
      this._y - other._y
    );
  },

  sub_: function(other) {

    this._x -= other._x;
    this._y -= other._y;

    return this;
  },

  mul: function(other) {

    return new Vec2(
      this._x * other._x,
      this._y * other._y
    );
  },

  mul_: function(other) {

    this._x *= other._x;
    this._y *= other._y;

    return this;
  },

  rotate: function(angle) {

    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    return new Vec2(
      this._x * cos - this._y * sin,
      this._x * sin + this._y * cos
    );
  },

  rotate_: function(angle) {

    var sin = Math.sin(angle);
    var cos = Math.cos(angle);

    var x = this._x;
    this._x = x * cos - this._y * sin;
    this._y = x * sin + this._y * cos;

    return this;
  },

  scale: function(scalar) {

    return new Vec2(
      this._x * scalar,
      this._y * scalar
    );
  },

  scale_: function(scalar) {

    this._x *= scalar;
    this._y *= scalar;

    return this;
  },

  len2: function() {

    return this.dot(this);
  },

  len: function() {

    return Math.sqrt(this.len2());
  },

  distance2: function(other) {

    return this.sub(other).len2();
  },

  distance: function(other) {

    return Math.sqrt(this.distance2(other));
  },

  unit: function() {

    var len = this.len();
    len = len > 0 ? len : 1;

    return this.scale(1 / len);
  },

  unit_: function() {

    var len = this.len();
    len = len > 0 ? len : 1;

    return this.scale_(1 / len);
  },

  clone: function() {
    return new Vec2(this._x, this._y);
  },

  copy_: function(other) {

    this._x = other._x;
    this._y = other._y;

    return this;
  },

  dot: function(other) {

    return this._x * other._x + this._y * other._y;
  },

  cross: function(other) {

    return this._x * other._y - this._y * other._x;
  },

  angle: function(other) {

    return Math.acos(this.dot(other) / (this.len() * other.len()));
  },

  signed_angle: function(other) {

    return Math.atan2(this.cross(other), this.dot(other));
  },

  map: function(fn) {

    return new Vec2(
      fn(this._x),
      fn(this._y)
    );
  },

  map_: function(fn) {

    this._x = fn(this._x);
    this._y = fn(this._y);

    return this;
  },

  set: function(x, y) {

    this._x = x;
    this._y = y;
  },

  get x() { return this._x; },
  set x(value) { this._x = value; },

  get y() { return this._y; },
  set y(value) { this._y = value; },

  toString: function() {

    return 'Vec2(' + this._x + ', ' + this._y + ')';
  }
};


module.exports = Vec2;
