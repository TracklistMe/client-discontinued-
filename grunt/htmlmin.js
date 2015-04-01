module.exports = {
    min: {
        files: [{
            expand: true,
            cwd: 'app/tpl/',
            src: ['*.html', '**/*.html'],
            dest: 'angular/tpl/',
            ext: '.html',
            extDot: 'first'
        }]
    }
}