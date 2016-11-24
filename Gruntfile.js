module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      build: ['es5'],
      dist: ['dist/*']
    },
    babel: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'es5/'
        }]
      }
    },
    browserify: {
      dist: {
        src: ['es5/**/*.js'],
        dest: 'dist/netconnection-polyfill.js'
      },
      options: {
        browserifyOptions: {
          standalone: 'somefunc'
        }
      }
    },
    copy: {
      swf:   {
        cwd: 'node_modules/netconnection-polyfill-swf/dist/',
        src: 'netconnection-polyfill.swf',
        dest: 'dist/',
        expand: true,
        filter: 'isFile'
      },
    }
  });

  grunt.registerTask('default', ['clean', 'babel', 'browserify', 'copy:swf']);
};
