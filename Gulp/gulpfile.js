var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cssmin = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    rimraf = require('rimraf'),
    uglify = require('gulp-uglify'),
    sassOptions = {
        errLogConsole: false,
        outputStyle: 'expanded'
    };

 var path = {
    // build: { //Тут мы укажем куда складывать готовые после сборки файлы
    //     html: 'build/',
    //     js: 'build/js/',
    //     css: 'build/css/',
    //     img: 'build/img/',
    //     fonts: 'build/fonts/'
    // },
    src: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/common.js',//В стилях и скриптах нам понадобятся только main файлы
        css: 'app/css/scss/style.scss',
        img: 'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    // watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    //     html: 'app/**/*.html',
    //     js: 'app/js/**/*.js',
    //     style: 'app/style/**/*.scss',
    //     img: 'app/img/**/*.*',
    //     fonts: 'app/fonts/**/*.*'
    // },
    clean: './dist'
};

// Скрипты проекта

gulp.task('js', function() {
	gulp.src(path.src.js)
	.pipe(uglify())
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
    .pipe(cssmin())
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

gulp.task('build', [
    'html',
    'js',
    'css',
    'fonts',
    'image'
]);

gulp.task('build', ['clean', 'image', 'css', 'js'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/style.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});


gulp.task('default', ['browser-sync'], function() {
	gulp.watch('app/css/**/*.scss', ['css']);
    gulp.watch('app/**/*.html', ['html']);
    gulp.watch('app/js/**/*.js', ['js']);
    gulp.watch('app/fonts/**/*', ['fonts']);
});

