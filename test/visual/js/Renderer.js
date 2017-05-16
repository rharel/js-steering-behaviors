/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function Renderer(default_style)
{
	this._style = default_style;
}
Renderer.prototype =
{
	constructor: Renderer,

	render_background: function(_2d)
	{
		_2d.save();

		_2d.fillStyle = 'white';
		_2d.fillRect(0, 0, _2d.canvas.width, _2d.canvas.height);

		_2d.restore();
	},
	render_body: function(_2d, body, user_style)
	{
		let style = Object.assign({}, this._style);
		if (user_style !== undefined)
		{
			style = Object.assign(style, user_style);
		}

		_2d.save();

		_2d.translate(0.5, 0.5);
		
		_2d.strokeStyle = style.stroke;
		_2d.fillStyle = style.fill;
		_2d.lineWidth = style.line_width;

		const w2 = 0.5 * style.size.x;
		const h2 = 0.5 * style.size.y;

		const heading = SB.Vector.X.rotate(body.orientation);

		const u = heading.scale(h2);
		const v = new SB.Vector(u.y, -u.x).unit_().scale_(w2);

		const a = body.position.add(u);
		const b = body.position.subtract(u).add_(v);
		const c = body.position.subtract(u.scale(0.5));
		const d = body.position.subtract(u).subtract_(v);

		_2d.beginPath();

		_2d.moveTo(a.x, a.y);
		_2d.lineTo(b.x, b.y);
		_2d.lineTo(c.x, c.y);
		_2d.lineTo(d.x, d.y);
		_2d.lineTo(a.x, a.y);

		_2d.fill();
		_2d.stroke();

		_2d.restore();
	}
};
