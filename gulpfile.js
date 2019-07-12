var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cssmin = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    rimraf = require('rimraf'),
    autoprefixer = require('gulp-autoprefixer'),
    sftp = require('gulp-sftp'),
    uglify = require('gulp-uglify'),
    sassOptions = {
        errLogConsole: false,
        outputStyle: 'expanded'
    };

 var path = {

    src: { 
        html: 'app/*.html', 
        js: 'app/js/common.js',
        css: 'app/css/scss/style.scss',
        img: 'app/img/**/*.*', 
        fonts: 'app/fonts/**/*.*'
    },

    clean: './dist'
};

// Скрипты проекта

gulp.task('js', function() {
	gulp.src(path.src.js)
	// .pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});



gulp.task('css', function(){ 
    gulp.src(path.src.css)
    .pipe(sass(sassOptions).on('error', sass.logError))
    // .pipe(cssmin())
    .pipe(autoprefixer({
        browsers: ['last 10 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function(){ 
    gulp.src(path.src.html)
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest('app/fonts'))
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('image', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('app/img'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build', ['clean', 'image', 'css', 'js', 'fonts', 'html'], function() {

    var buildCss = gulp.src('app/css/*.css')
                   .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
                    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*')
                  .pipe(gulp.dest('dist/js'))

    var buildImg = gulp.src('app/img/**/*')
                  .pipe(gulp.dest('dist/img'));

    var buildHtml = gulp.src('app/*.html')
    			   .pipe(gulp.dest('dist'));

});


gulp.task('default', ['browser-sync'], function() {
	gulp.watch('app/css/**/*.scss', ['css']);
    gulp.watch('app/**/*.html', ['html']);
    gulp.watch('app/js/**/*.js', ['js']);
    gulp.watch('app/fonts/**/*', ['fonts']);
});

