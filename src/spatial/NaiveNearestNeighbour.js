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
	 * @param data
	 * 		The data associated with the site (default is null).
	 */
	set_site_position: function(id, position, data = null)
	{
		this._sites[id] = { position: position, data: data };
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
	 * Retrieve all sites that are within the specified distance from a specified
	 * query position.
	 *
	 * @param query
	 * 		The query position.
	 * @param radius
	 * 		The radius of the query.
	 * @returns
	 * 		An array of nearby sites.
	 */
	get_nearest_in_radius: function(query, radius)
	{
		let results = [];

		for (const id in this._sites)
		{
			if (!this._sites.hasOwnProperty(id)) { continue; }
			if (this._sites[id].position.distance_to(query) <= radius)
			{
				results.push(this._sites[id]);
			}
		}
		return results;
	}
};


module.exports = NaiveNearestNeighbour;
