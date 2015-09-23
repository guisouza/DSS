module.exports = function(grunt) {
  'use strict';

  var tasks = [
    'grunt-contrib-jshint',
    'grunt-contrib-concat',
    'grunt-contrib-jasmine',
    'grunt-contrib-watch',
    'grunt-contrib-uglify',
  ];

 var config = {};

  // *********************************************
  // jshint
  config.jshint = {};
  config.jshint.all = ['src/**/*.js'];
  config.jshint.options = {
    jshintrc : true
  }


  // *********************************************
  // concat
  config.concat = {
    dist: {
      src: [
        'src/dss.js',
        'src/core/*.js',
        'src/interface/*.js',
        'src/defaultProperties/*.js'
      ],
      dest: 'dist/dss.js'
    }
  }


  // *********************************************
  // uglify
  config.uglify = {};
  config.uglify.all = {
    files: {
      'dist/dss.min.js': [ 'dist/dss.js' ]
    },
    options: {
      preserveComments: false,
      sourceMap: 'dist/dss.min.map',
      sourceMappingURL: 'dss.min.map',
      report: 'min',
      beautify: {
        ascii_only: true
      },
      compress: {
        hoist_funs: false,
        loops: false,
        unused: false
      }
    }
  }

  grunt.initConfig(config);

  tasks.forEach(grunt.loadNpmTasks);

  grunt.registerTask('hint', ['jshint']);

  grunt.registerTask('test', ['jasmine']);

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
