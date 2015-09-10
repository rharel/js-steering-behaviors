/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-steering-behaviors
 */


module.exports = function(grunt) {

  config = {
    pkg: grunt.file.readJSON('package.json'),
    src_dir: 'src/',
    test_dir: 'test/',
    dist_dir: 'dist/',
    source_files: '<%= src_dir %>**/*.js' ,
    test_files: '<%= test_dir %>**/*.test.js',

    jshint: {
      all: [
        '<%= source_files %>',
        '<%= test_files %>'
      ]
    },

    clean: {
      release: {
        src: [
          '<%= dist_dir %>**/*.js'
        ]
      }
    },

    mochacli: {
      options: {
        require: ['chai'],
        reporter: 'spec',
        bail: true
      },
      all: '<%= test_files %>'
    },

    browserify: {
      release: {
        src: '<%= src_dir %>/index.js',
        dest: '<%= dist_dir %>/steering_behaviors.js'
      }
    },

    uglify: {
      release: {
        files: {
          '<%= dist_dir %>/steering_behaviors.min.js': ['<%= dist_dir %>/steering_behaviors.js']
        }
      }
    }
  };

  grunt.registerTask('build', [
    'clean:release',
    'browserify:release',
    'uglify:release'
  ]);
  grunt.registerTask('test', ['mochacli:all']);
  grunt.registerTask('dev', [
    'jshint:all',
    'test'
  ]);
  grunt.registerTask('release', [
    'jshint:all',
    'test',
    'build'
  ]);
  grunt.registerTask('default', 'dev');

  require('load-grunt-tasks')(grunt);

  return grunt.initConfig(config);
};