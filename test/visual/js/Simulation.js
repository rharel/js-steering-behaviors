/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


function Simulation(world_width, world_height)
{
	this._world_size = new SB.Vector(world_width, world_height);
	this._agents = [];
}
Simulation.prototype =
{
	constructor: Simulation,

	step: function(dt)
	{
		this._agents.forEach(agent =>
		{
			const body = agent.body;
			const behavior = agent.behavior;

			body.net_force.set(0, 0);
			body.apply_force(behavior.drive(body, dt));
			body.step(dt);

			this._enforce_world_bounds(body.position);
			this._discard_small_values(body.velocity);
		});
	},
	_enforce_world_bounds: function(position)
	{
		const p = position;
		if (p.x < 0 || p.x > this._world_size.x)
		{
			p.x = this._world_size.x - p.x;
		}
		if (p.y < 0 || p.y > this._world_size.y)
		{
			p.y = this._world_size.y - p.y;
		}
	},
	_discard_small_values: function(v)
	{
		v.map_(x => Math.abs(x) < Simulation.EPSILON ? 0 : x);
	},

	get world_size() { return this._world_size; },
	get agents() { return this._agents; }
};

Simulation.EPSILON = 0.001;
