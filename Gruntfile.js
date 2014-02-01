var rode = require('./rode');

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
					'tests/**/*.js',
					'src/**/Tests/**/*.js'
				]
		    }
	    }
    });

	grunt.registerTask('prepareTest', 'Test Environment', function() {
		rode.getCoreConfig('test', true);
	});

	// Run tests //
	grunt.registerTask('test', [
		'prepareTest',
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
