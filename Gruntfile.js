module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    'babel': {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'es5/'
        }]
      }
    },
    'browserify': {
      dist: {
        src: ['es5/**/*.js'],
        dest: 'dist/netconnection-polyfill.js'
      },
      options: {
        browserifyOptions: {
          standalone: 'somefunc'
        }
      }
    }
  });

  grunt.registerTask('default', ['babel', 'browserify']);
};
