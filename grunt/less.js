module.exports = {
  aphextwin: {
    plugins: [
      new(require('less-plugin-autoprefix'))({
        browsers: ["last 2 versions"]
      }),
      new(require('less-plugin-clean-css'))()
    ],
    files: {
      'src/css/aphextwin.css': 'src/css/less/aphextwin/aphextwin.less'
    }
  }
}
