/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2017 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


/**
 * A naive data structure for nearest-neighbour queries.
 *
 * @constructor
 */
function NaiveNearestNeighbour()
{
	this._sites = {};  // Mapping: id => position
}
NaiveNearestNeighbour.prototype =
{
	constructor: NaiveNearestNeighbour,

	/**
	 * Sets a site's position.
	 *
	 * @param id
	 * 		The site's ID.
	 * @param position
	 * 		The site's position.
	 */
	set_site_position: function(id, position)
	{
		this._sites[id] = position;
	},
	/**
	 * Removes a site from the index.
	 *
	 * @param id
	 * 		The site's ID.
	 */
	remove_site: function(id)
	{
		delete this._sites[id];
	},

	/**
	 * Compute all sites that are within the specified distance_to from a specified
	 * query position.
	 *
	 * @param position
	 * 		The query position.
	 * @param radius
	 * 		The radius of the query.
	 * @returns
	 * 		An array of site IDs.
	 */
	get_nearest_in_radius: function(position, radius)
	{
		let positions = [];

		for (const id in this._sites)
		{
			if (this._sites.hasOwnProperty(id) &&
			    this._sites[id].distance_to(position) <= radius)
			{
				positions.push(this._sites[id]);
			}
		}
		return positions;
	}
};


module.exports = NaiveNearestNeighbour;
