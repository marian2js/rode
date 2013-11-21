var config = {
	mongo: {
		uri: 'mongodb://localhost/rodetest',
		options: {},
		autoconnect: true
	},
	port: process.env.PORT || 5000
};
module.exports = config;