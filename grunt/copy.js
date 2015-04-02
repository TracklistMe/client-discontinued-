module.exports = {
    angular: {
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
            },

            expand: true,
            src: "**",
            cwd: 'bower_components/jquery.sparkline/dist/',
            dest: "angular/bower_components/jquery.sparkline/dist"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/angularjs-toaster/',
            dest: "angular/bower_components/angularjs-toaster"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/videogular-buffering/',
            dest: "angular/bower_components/videogular-buffering"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/screenfull/',
            dest: "angular/bower_components/screenfull"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/videogular-controls/',
            dest: "angular/bower_components/videogular-controls"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/videogular-poster/',
            dest: "angular/bower_components/videogular-poster"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/videogular-overlay-play/',
            dest: "angular/bower_components/videogular-overlay-play"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/font-awesome/fonts',
            dest: "angular/fonts"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/jquery.sparkline/dist',
            dest: "angular/bower_components/jquery.sparkline/dist"
        },
        {
            expand: true,
            src: "**",
            cwd: 'bower_components/simple-line-icons/fonts',
            dest: "angular/fonts"
        },
        {
            expand: true,
            src: "**",
            cwd: 'src/fonts',
            dest: "angular/fonts"
        },
        {
            expand: true,
            src: "**",
            cwd: 'src/l10n',
            dest: "angular/l10n"
        },
        {
            expand: true,
            src: "**",
            cwd: 'src/img',
            dest: "angular/img"
        },
        {
            expand: true,
            src: "**",
            cwd: 'src/js',
            dest: "angular/js"
        },
        {
            expand: true,
            src: "**",
            cwd: 'src/tpl',
            dest: "angular/tpl"
        },
        {
            src: 'src/index.min.html',
            dest: 'angular/index.html'
        }
    ]
},
html: {
    files: [{
        expand: true,
        src: "**",
        cwd: 'bower_components/bootstrap/fonts',
        dest: "html/fonts"
    }, {
        expand: true,
        src: "**",
        cwd: 'bower_components/font-awesome/fonts',
        dest: "html/fonts"
    }, {
        expand: true,
        src: "**",
        cwd: 'bower_components/Simple-Line-Icons/fonts',
        dest: "html/fonts"
    }, {
        expand: true,
        src: '**',
        cwd: 'src/fonts/',
        dest: 'html/fonts/'
    }, {
        expand: true,
        src: "**",
        cwd: 'src/api',
        dest: "html/api"
    }, {
        expand: true,
        src: '**',
        cwd: 'src/img/',
        dest: 'html/img/'
    }, {
        expand: true,
        src: '*.css',
        cwd: 'src/css/',
        dest: 'html/css/'
    }, {
        expand: true,
        src: '**',
        cwd: 'swig/js/',
        dest: 'html/js/'
    }]
},
landing: {
    files: [{
        expand: true,
        src: "**",
        cwd: 'bower_components/bootstrap/fonts',
        dest: "landing/fonts"
    }, {
        expand: true,
        src: "**",
        cwd: 'bower_components/font-awesome/fonts',
        dest: "landing/fonts"
    }, {
        expand: true,
        src: "**",
        cwd: 'bower_components/Simple-Line-Icons/fonts',
        dest: "landing/fonts"
    }, {
        expand: true,
        src: '**',
        cwd: 'src/fonts/',
        dest: 'landing/fonts/'
    }, {
        expand: true,
        src: '*.css',
        cwd: 'src/css/',
        dest: 'landing/css/'
    }, {
        src: 'html/css/app.min.css',
        dest: 'landing/css/app.min.css'
    }]
}

};