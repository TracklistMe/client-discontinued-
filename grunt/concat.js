module.exports = {
  angular: {
    src: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/moment/min/moment.min.js',
      'bower_components/d3/d3.min.js',
      'bower_components/n3-line-chart/build/line-chart.min.js',


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
  },
  html: {
    src: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'html/js/*.js'
    ],
    dest: 'html/js/app.src.js'
  }
}
