var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    sassOptions = {
        errLogConsole: false,
        outputStyle: 'expanded'
    };

gulp.task('sass', function(){ 
    gulp.src('css/scss/style.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest('css/'));
});


// gulp.task('scripts', function() {
//     return gulp.src('./css/scss/**/*.scss')
//     .pipe(concat('style.css'))
//     .pipe(gulp.dest('./css/'));
// });

gulp.task('default', function() {
    gulp.watch('css/**/*.scss', ['sass']);
    // gulp.watch('./css/scss/**/*.scss', ['scripts']);
});