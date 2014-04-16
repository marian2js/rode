require('./setup');

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-mocha-test');

	// Project configuration.
	grunt.initConfig({
		// Configure a mochaTest task
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: [
				  'src/**/Tests/**/*.js'
				]
			}
		}
	});

  grunt.registerTask('startTestEnvironment', 'Test Environment', function() {
    process.env.NODE_ENV = 'test';
    require('rode');
  });

	// Run tests //
	grunt.registerTask('test', [
    'startTestEnvironment',
		'mochaTest'
	]);

	// Build tasks //
	grunt.registerTask('build', [

	]);

	// Default tasks //
	grunt.registerTask('default', [
		'test',
		'build'
	]);

};