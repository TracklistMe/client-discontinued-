'use strict';

module.exports = function(grunt) {

  var gtx = require('gruntfile-gtx').wrap(grunt);
  gtx.loadAuto();

  var gruntConfig = require('./grunt');
  gruntConfig.package = require('./package.json');

  //Configure modules that required specific setup
  gtx.config({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    }
  });

  gtx.initConfig({
    connect: {
      production: {
        options: {
          port: 9000,
          base: 'angular/'
        }
      },
      debug: {
        options: {
          port: 9000,
          base: 'src/'
        }
      }
    }
  });
  // Configuration for watch
  gtx.initConfig({
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['lint']
      },
    },
  });

  // Configuration for concurrent
  gtx.initConfig({
    concurrent: {
      developEnviroment: {
        tasks: ['watch', 'serve:debug'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });


  gtx.config(gruntConfig);
  //Built the client 
  gtx.alias('build:angular', ['recess:less', 'clean:angular', 'copy:angular',
    'recess:angular', 'concat:angular', 'uglify:angular'
  ]);
  //Build the html miniwebsite 
  gtx.alias('build:html', ['clean:html', 'copy:html', 'recess:html',
    'swig:html', 'concat:html', 'uglify:html'
  ]);
  //Build the landing page
  gtx.alias('build:landing', ['copy:landing', 'swig:landing']);
  //Run the linter
  gtx.alias('lint', ['jshint']);
  //Run the webserver on the src/ folder and keep watching the changes.
  //Every time you save a file the linter starts.
  gtx.alias('develop', ['concurrent:developEnviroment']);
  //Start the local webserver with the debug version of the site
  gtx.alias('serve:debug', ['connect:debug:keepalive']);
  //Compile the site and start the local webserver on the production code
  gtx.alias('serve:production', ['build:angular',
    'connect:production:keepalive'
  ]);

  /* Do not use the following command, they are not consistent at the momet.
  gtx.alias('release', ['bower-install-simple',
   'build:angular', 'bump-commit']);
  gtx.alias('release-patch', ['bump-only:patch', 'release']);
  gtx.alias('release-minor', ['bump-only:minor', 'release']);
  gtx.alias('release-major', ['bump-only:major', 'release']);
  gtx.alias('prerelease', ['bump-only:prerelease', 'release']);
  */

  gtx.finalise();
};
