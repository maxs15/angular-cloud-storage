'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.initConfig({

		connect: {
			server: {
				options: {
					port: 8080,
					base: './',
					keepalive: true
				}
			}
		}

	});

};