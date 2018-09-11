module.exports = function (grunt) {


	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ["dist", '.tmp'],

		copy: {
			main: {
				expand: true,
				cwd: '../',
				src: ['**',
				      '!js/**',
				      '!lib/**',
				      '!global/lib/**',
				      '!global/st-api/**/*.js',
				      '!**/*.css',
				      '!**/*.png',
				      '*.png'],
				dest: 'java2/'
			}
		}
			
		

	});

	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-rev'); //Adiciona números aleatórios aos nomes dos arquivos minificados (Util para lógicas de cache)
	grunt.loadNpmTasks('grunt-usemin');

	// Tell Grunt what to do when we type "grunt" into the terminal

	grunt.registerTask('war', [
	                           'war'
	                           ]);
	grunt.registerTask('default', [
	                              // 'karma',
	                              // 'copy',
	                              // 'useminPrepare',
	                              // 'concat',
	                              // 'uglify',
	                               //'cssmin',
	                               //'usemin',
	                               'copy'
	                               ]);

	grunt.registerTask('end2end', ['protractor']);
};