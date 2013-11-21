var config = {
	port: process.env.PORT || 5000,
	mongo: {
		uri: 'mongodb://localhost/app_name_test',
		options: {},
		autoconnect: true
	}
};
module.exports = config;