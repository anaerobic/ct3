var gulp = require('gulp'),
  babel = require('gulp-babel'),
  nodemon = require('gulp-nodemon'),
  jasmine = require('gulp-jasmine');

gulp.task('build', function () {
    return gulp.src(['src/*.js', 'lib/*.js'], {base: "."})
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], function () {
    return gulp.src('dist/**/*.test.js')
        .pipe(jasmine());
});

gulp.task('start', function () {
  nodemon({
    script: 'dist/src/*.js',
    ignore: ['dist/**/*.*'],
    ext: 'js yml',
    env: { 'NODE_ENV': 'development' },
    tasks: ['build', 'test']
  })
});


gulp.task('default', ['build', 'test', 'start']);
