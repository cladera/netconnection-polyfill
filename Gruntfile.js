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
      options: {
        browserifyOptions: {
          standalone: 'NetConnection'
        }
      },
      dist: {
        src: ['es5/netconnection.js'],
        dest: 'dist/netconnection-polyfill.js'
      },
    },
    copy: {
      options: {
        processContentExclude: ['**/*.{png,gif,jpg,ico,psd,swf}']
      },
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
