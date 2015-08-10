module.exports = {
  all: {
    src: [
      'Gruntfile.js', 'src/js/controllers/{,*/}*.js'
      //'Gruntfile.js', 'src/js/**/*.js'
    ]
  },
  test: {
    options: {
      jshintrc: 'test/.jshintrc'
    },
    src: ['test/spec/{,*/}*.js']
  }
}
