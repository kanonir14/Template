var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require("gulp-imagemin"),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify');

var sassOptions = {
    errLogConsole: false,
    outputStyle: 'expanded'
};

 var path = {

    styles: {
        src: 'app/css/scss/**/*.scss', // попробовать прописать путь app/css/**/*.scss
        src_css: 'app/css/',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'app/js/common.js', // попробовать прописать путь app/js/**/*.js
        src_lib: 'app/libs/*.js',
        dest: 'dist/js/',
        dest_lib: 'dist/libs/'
    },
    html: {
        src: 'app/index.html',
        dest: 'dist/'
    },
    fonts: {
        src: 'app/fonts/**/*.*',
        dest: 'dist/fonts/'
    },
    images: {
        src: 'app/img/**/*.*',
        dest: 'dist/img/'
    }
};

gulp.task('browser-sync', function() { 
    browserSync({
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });

    gulp.watch(path.html.src).on('change', browserSync.reload);
});

function clean() {
    // return del(['app/css/*.css', '!app/css/style.css', '!app/css/scss', 'dist/css/*.css', '!dist/css/style.css']);
    return del(['dist']);
}

// css
function styles() {
    return gulp.src(path.styles.src)
        .pipe(sass(sassOptions)).on('error', sass.logError)
        // .pipe(cleanCSS())
        // .pipe(rename({
        //     basename: 'style',
        //     suffix: '.min'
        // }))
        .pipe(autoprefixer({
            browsersList: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.styles.src_css))
        .pipe(browserSync.stream());

}

// images
function images() {
    return gulp.src(path.images.src) 
        .pipe(imagemin())
        .pipe(gulp.dest(path.images.dest))
        .pipe(browserSync.stream());
}

// fonts
function fonts() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.fonts.dest));
}

// html
function html(){
    return gulp.src(path.html.src)
    .pipe(browserSync.reload({stream:true}));
}

// js
function scripts() {
    return gulp.src(path.scripts.src)
        .pipe(browserSync.stream())
        // .pipe(gulp.dest(path.scripts.dest));
}

// build

function buildProject() {
    var build_css = gulp.src(path.styles.src_css)
        .pipe(gulp.dest(path.styles.dest));

    var build_html = gulp.src(path.html.src)
        .pipe(gulp.dest(path.html.dest));

    var build_js = gulp.src(path.scripts.src)
        .pipe(gulp.dest(path.scripts.dest));

    var build_img = images();

    var build_fonts = gulp.src(path.fonts.src)
        .pipe(gulp.dest(path.fonts.dest));

    return build_css, build_html, build_js, build_fonts;
}

var build = gulp.series(clean, buildProject);

// clean
var clean = gulp.series(clean);

// watch
function watchFiles(){
    gulp.watch(path.styles.src, styles);
    gulp.watch(path.scripts.src, scripts);
    gulp.watch(path.html.src, html);
    gulp.watch(path.images.src, images);
}

var watch = gulp.parallel(watchFiles, ['browser-sync']);


// exports
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.build = build;
exports.images = images;

// default start 
exports.default = watch;


