/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


var RIGHT = new SB.Vec2(1, 0);


function Renderer(marker_size, marker_style) {

  this._marker_size = marker_size;
  this._marker_style = marker_style;
}


Renderer.prototype = {

  constructor: Renderer,

  render: function(_2d, characters) {

    _2d.save();

    _2d.translate(0.5, 0.5);

    _2d.fillStyle = 'white';
    _2d.fillRect(0, 0, _2d.canvas.width, _2d.canvas.height);

    _2d.strokeStyle = this._marker_style.stroke;
    _2d.lineWidth = this._marker_style.line_width;

    var w2 = 0.5 * this._marker_size.x;
    var h2 = 0.5 * this._marker_size.y;

    characters.forEach(

      function(character) {

        var heading = RIGHT.rotate(character.orientation);

        var u = heading.scale(h2);
        var v = new SB.Vec2(u.y, -u.x).unit_().scale_(w2);

        var a = character.position.add(u);
        var b = character.position.sub(u).add_(v);
        var c = character.position.sub(u.scale(0.5));
        var d = character.position.sub(u).sub_(v);

        _2d.fillStyle = character.color;

        _2d.beginPath();

        _2d.moveTo(a.x, a.y);
        _2d.lineTo(b.x, b.y);
        _2d.lineTo(c.x, c.y);
        _2d.lineTo(d.x, d.y);
        _2d.lineTo(a.x, a.y);

        _2d.fill();
        _2d.stroke();
      }
    );

    _2d.restore();
  }
};
