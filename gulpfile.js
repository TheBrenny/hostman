const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');

gulp.task("sass", function () {
    return gulp.src("app/assets/scss/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("app/assets/css/"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task("browserSync", function (cb) {
    return browserSync.init({
        proxy: "http://hostman/",
        files: ["app/assets/**/*.*", "app/views/**/*.*"],
        browser: false,
        port: 81
    }, cb);
});

gulp.task("nodemon", function (cb) {
    var started = false;

    return nodemon({
        script: 'hostman.js',
        env: {
            "NODE_ENV": 'dev',
            "GULPING": true
        }
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});
gulp.task("watch", gulp.series("sass", function (cb) {
    gulp.watch("app/assets/scss/**/*.scss", gulp.series("sass"));
    cb();
}));

gulp.task("default", gulp.series("nodemon", "browserSync", "watch"));