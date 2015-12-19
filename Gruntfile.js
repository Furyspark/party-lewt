module.exports = function(grunt) {
	grunt.initConfig({
		shell: {
			run: {
				command: "node main.js"
			}
		},

		concat: {
			classes: {
				options: {
					separator: "\n\n"
				},
				src: [
					"src/classes/item.js"
				],
				dest: "temp/classes.js"
			},
			dist: {
				options: {
					separator: "\n\n"
				},
				src: [
					"temp/classes.js",
					"src/main.js"
				],
				dest: "main.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-shell");

	grunt.registerTask("test", ["concat:dist", "shell:run"]);
};