'use strict';

// This shows a full config file!
module.exports = function(grunt) {
  grunt.initConfig({
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },
    watch: {
      development: {
        files: ['src/js/{,*/}*.js', 'src/css/{,*/}*.css', 'src/css/less/aphextwin/{,*/}*.css'],
        tasks: ['less:development', 'jshint']
      },
    },
    uglify: {
      production: {
        /*
        src: [
          'angular/js/app.min.js'
        ],
        dest: 'angular/js/app.min.js'
        */
      }
    },
    concat: {
      production: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/moment/min/moment.min.js',
          'bower_components/bootstrap-daterangepicker/daterangepicker.js',
          'bower_components/angular/angular.js',
          'bower_components/d3/d3.min.js',
          'bower_components/n3-line-chart/build/line-chart.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-cookies/angular-cookies.js',
          'bower_components/angular-resource/angular-resource.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'bower_components/angular-touch/angular-touch.js',
          'bower_components/angular-ui-router/release/angular-ui-router.js',
          'bower_components/ngstorage/ngStorage.js',
          'bower_components/angular-ui-utils/ui-utils.js',
          'bower_components/satellizer/satellizer.js',
          'bower_components/html.sortable/dist/html.sortable.js',
          'bower_components/html.sortable/dist/html.sortable.angular.js',
          'bower_components/bower-jquery-sparkline/dist/jquery.sparkline.retina.js',
          'bower_components/bower-jquery-easyPieChart/dist/jquery.easypiechart.fill.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          'bower_components/oclazyload/dist/ocLazyLoad.js',
          'bower_components/jquery.sparkline/dist/jquery.sparkline.retina.js',
          'bower_components/angular-smart-table/dist/smart-table.min.js',
          'bower_components/angular-translate/angular-translate.js',
          'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
          'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
          'bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
          'bower_components/angular-stripe/release/angular-stripe.js',
          'bower_components/angular-credit-cards/release/angular-credit-cards.js',
          'src/js/*.js',
          'src/js/directives/*.js',
          'src/js/services/*.js',
          'src/js/filters/*.js',
          'src/js/libs/cart/*.js',
          'src/js/controllers/bootstrap.js'
        ],
        dest: 'angular/js/app.min.js'
      }
    },
    recess: {
      production: {
        files: {
          'angular/css/app.min.css': [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/animate.css/animate.css',
            'bower_components/font-awesome/css/font-awesome.css',
            'bower_components/simple-line-icons/css/simple-line-icons.css',
            'src/css/*.css'
          ]
        },
        options: {
          compress: true
        }
      }
    },
    copy: {
      production: {
        files: [{
          expand: true,
          src: "**",
          cwd: 'bower_components/bootstrap/fonts',
          dest: "angular/fonts"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/videogular/',
          dest: "angular/bower_components/videogular"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/jquery.sparkline/dist/',
          dest: "angular/bower_components/jquery.sparkline/dist"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/angularjs-toaster/',
          dest: "angular/bower_components/angularjs-toaster"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/',
          dest: "angular/bower_components"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/videogular-buffering/',
          dest: "angular/bower_components/videogular-buffering"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/screenfull/',
          dest: "angular/bower_components/screenfull"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/videogular-controls/',
          dest: "angular/bower_components/videogular-controls"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/videogular-poster/',
          dest: "angular/bower_components/videogular-poster"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/videogular-overlay-play/',
          dest: "angular/bower_components/videogular-overlay-play"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/font-awesome/fonts',
          dest: "angular/fonts"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/jquery.sparkline/dist/',
          dest: "angular/bower_components/jquery.sparkline/dist"
        }, {
          expand: true,
          src: "**",
          cwd: 'bower_components/simple-line-icons/fonts',
          dest: "angular/fonts"
        }, {
          expand: true,
          src: "**",
          cwd: 'src/fonts',
          dest: "angular/fonts"
        }, {
          expand: true,
          src: "**",
          cwd: 'src/l10n',
          dest: "angular/l10n"
        }, {
          expand: true,
          src: "**",
          cwd: 'src/img',
          dest: "angular/img"
        }, {
          expand: true,
          src: "**",
          cwd: 'src/js',
          dest: "angular/js"
        }, {
          expand: true,
          src: "**",
          cwd: 'src/tpl',
          dest: "angular/tpl"
        }, {
          src: 'bower_components/jquery/dist/jquery.min.map',
          dest: 'angular/js/jquery.min.map'
        }, {
          src: 'src/index.min.html',
          dest: 'angular/index.html'
        }, {
          src: 'src/favicon.ico',
          dest: 'angular/favicon.ico'
        }]
      }
    },
    clean: {
      production: ["angular"]
    },

    less: {
      development: {
        files: [{
          'src/css/app.css': 'src/css/less/app.less'
        }, {
          'src/css/aphextwin.css': 'src/css/less/aphextwin/aphextwin.less'

        }]
      },
      production: {
        files: {
          'src/css/app.css': 'src/css/less/app.less'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: ['Gruntfile.js', 'src/js/controllers/{,*/}*.js']
    },
    browserSync: {
      development: {

        bsFiles: {
          src: [
            'src/css/{,*/}*.css',
            'src/*.html'
          ]
        },
        options: {
          port: 9000,
          watchTask: true,
          server: './src'
        }
      }
    }
  });

  // load npm tasks
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-uncss');

  // build production, including
  // 1- clean the current production 
  // 2- compile all the .less to .css
  // 3- removed all the unused css
  // 4- copy the src to production 
  // 5- recess and compress all the css 
  // 6- concat all the js
  // 7- uglify the js code 
  grunt.registerTask('build:production', ['clean:production',
    'less:production',
    'copy:production',
    'uncss:production',
    'recess:production',
    'concat:production',
    'uglify:production'
  ]);
  // define default task
  grunt.registerTask('development', ['browserSync:development', 'watch']);
};
