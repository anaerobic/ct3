var gulp = require('gulp'),
  babel = require('gulp-babel'),
  nodemon = require('gulp-nodemon');


gulp.task('build', function () {
    return gulp.src(['server.js', 'lib/*.js'], {base: "."})
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('start', function () {
  nodemon({
    script: 'dist/server.js',
    ignore: ['dist/**/*.*'],
    ext: 'js yml',
    env: { 'NODE_ENV': 'development' },
    tasks: ['build']
  })
});


gulp.task('default', ['build', 'start']);
