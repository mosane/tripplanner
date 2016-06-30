var Sequelize = require('sequelize');
var db = require('./_db');

var Day =  db.define('day', {
	number: {
		type: Sequelize.INTEGER,
		allowNull: false,
		unique: true
	},
	hotelName: {
		type: Sequelize.STRING
	},

	restaurantsArr: {
		type: Sequelize.ARRAY(Sequelize.STRING)
	},
	activitiesArr: {
		type: Sequelize.ARRAY(Sequelize.STRING)
	}
})

module.exports = Day