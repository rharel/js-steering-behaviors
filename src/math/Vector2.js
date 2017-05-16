/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * Represents a two-dimensional vector.
 *
 * @constructor
 * @param x
 * 		The vector's first coordinate.
 * @param y
 *		The vector's second coordinate.
 * @note
 *    Methods with suffix '_' (underscore) denote an in-place operation.
 */
function Vector2(x, y)
{
	this._x = x;
	this._y = y;
}
Vector2.prototype =
{
	constructor: Vector2,

	/**
	 * Performs negation.
	 */
	negate: function()
	{
		return this.scale(-1);
	},
	/**
	 * Performs negation (in-place).
	 */
	negate_: function()
	{
		return this.scale_(-1);
	},

	/**
	 * Performs element-wise addition.
	 */
	add: function(other)
	{
		return new Vector2
		(
			this._x + other._x,
			this._y + other._y
		);
	},
	/**
	 * Performs element-wise addition (in-place).
	 */
	add_: function(other)
	{
		this._x += other._x;
		this._y += other._y;

		return this;
	},

	/**
	 * Performs element-wise subtraction.
	 */
	subtract: function(other)
	{
		return new Vector2
		(
			this._x - other._x,
			this._y - other._y
		);
	},
	/**
	 * Performs element-wise subtraction (in-place).
	 */
	subtract_: function(other)
	{
		this._x -= other._x;
		this._y -= other._y;

		return this;
	},

	/**
	 * Performs element-wise multiplication.
	 */
	multiply: function(other)
	{
		return new Vector2
		(
	    	this._x * other._x,
	  		this._y * other._y
		);
	},
	/**
	 * Performs element-wise multiplication (in-place).
	 */
	multiply_: function(other)
	{
		this._x *= other._x;
		this._y *= other._y;

		return this;
	},

	/**
	 * Performs rotation by an angle_to.
	 *
	 * @param angle
	 * 		Angle of rotation (in radians).
	 */
	rotate: function(angle)
	{
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		return new Vector2
		(
	  		this._x * cos - this._y * sin,
	  		this._x * sin + this._y * cos
		);
	},
	/**
	 * Performs rotation by an angle_to (in-place).
	 *
	 * @param angle
	 * 		Angle of rotation (in radians).
	 */
	rotate_: function(angle)
	{
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		const x = this._x;
		this._x = x * cos - this._y * sin;
		this._y = x * sin + this._y * cos;

		return this;
	},

	/**
	 * Performs scaling.
	 */
	scale: function(scalar)
	{
		return new Vector2
		(
			this._x * scalar,
	  		this._y * scalar
		);
	},
	/**
	 * Performs scaling (in-place).
	 */
	scale_: function(scalar)
	{
		this._x *= scalar;
		this._y *= scalar;

		return this;
	},

	/**
	 * Computes the squared norm.
	 */
	squared_norm: function()
	{
		return this.dot(this);
	},
	/**
	 * Computes the norm.
	 */
	norm: function()
	{
		return Math.sqrt(this.squared_norm());
	},

	/**
	 * Computes the squared distance between vectors.
	 */
	squared_distance_to: function(other)
	{
		return this.subtract(other).squared_norm();
	},
	/**
	 * Computes the distance between vectors.
	 */
	distance_to: function(other)
	{
		return Math.sqrt(this.squared_distance_to(other));
	},

	/**
	 * Performs normalization.
	 */
	unit: function()
	{
		const n = this.norm();
		return (
			n === 0 ?
			this.clone() :
			this.scale(1 / n)
		);
	},
	/**
	 * Performs normalization (in-place).
	 */
	unit_: function()
	{
		const n = this.norm();
		return (
			n === 0 ?
			this :
			this.scale_(1 / n)
		);
	},

	/**
	 * Produces a clone of this.
	 */
	clone: function()
	{
		return new Vector2(this._x, this._y);
	},
	/**
	 * Assigns the values of another to this (in-place).
	 */
	assign: function(other)
	{
		this._x = other._x;
		this._y = other._y;

		return this;
	},

	/**
	 * Performs the dot product.
	 */
	dot: function(other)
	{
		return this._x * other._x +
			   this._y * other._y;
	},
	/**
	 * Performs the cross product.
	 */
	cross: function(other)
	{
		return this._x * other._y -
			   this._y * other._x;
	},

	/**
	 * Computes the angle_to between two vectors.
	 */
	angle_to: function(other)
	{
		return Math.acos
		(
			this.dot(other) /
			(this.norm() * other.norm())
		);
	},
	/**
	 * Computes the signed angle_to between two vectors.
	 */
	signed_angle_to: function(other)
	{
		return Math.atan2
		(
			this.cross(other),
			this.dot(other)
		);
	},

	/**
	 * Performs element-wise mapping.
	 *
	 * @param f
	 * 		The mapping function.
	 */
	map: function(f)
	{
		return new Vector2
		(
	    	f(this._x),
			f(this._y)
		);
	},
	/**
	 * Performs element-wise mapping (in-place).
	 *
	 * @param f
	 * 		The mapping function.
	 */
	map_: function(f)
	{
		this._x = f(this._x);
		this._y = f(this._y);

		return this;
	},

	/**
	 * Sets coordinate values for this (in-place).
	 */
	set: function(x, y)
	{
		this._x = x;
		this._y = y;

		return this;
	},

	get x() { return this._x; },
	set x(value) { this._x = +value; },

	get y() { return this._y; },
	set y(value) { this._y = +value; },

	toString: function()
	{
		return `Vector2(${this._x}, ${this._y})`;
	}
};

Vector2.ZERO = new Vector2(0, 0);
Vector2.X = new Vector2(1, 0);
Vector2.Y = new Vector2(0, 1);


module.exports = Vector2;
