var gulp = require('gulp');
var concat = require("gulp-concat")
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var source = require('vinyl-source-stream');

var paths = {
    cssfiles : ["./bower_components/bootstrap/dist/css/*.min.css", "./bower_components/jquery-ui/themes/ui-lightness/*.min.css", "./bower_components/animate.css/animate.min.css", "./css/style.css"],
    jsfiles : [ "./bower_components/jquery/jquery.min.js", "./bower_components/jquery-ui/*.min.js", "./bower_components/jquery.scrollTo/*.min.js", "./bower_components/bootstrap/dist/js/*.min.js", "./node_modules/mithril/mithril.js",  "./script.js" ],
    less : [ "./less/*.less"]
}

gulp.task("less", function(){
    gulp.src(paths.less)
        .pipe(less())
        .pipe(gulp.dest('./css'));
})


gulp.task('css', ["less"], function(){
    return gulp.src(paths.cssfiles)
        .pipe(concat('bundle.css'))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest('./demo/'))
});

gulp.task('js', function(){
    return gulp.src(paths.jsfiles)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./demo/'))
});

gulp.task('watch', function() {
    gulp.watch(paths.less, ['css']);
    gulp.watch(paths.jsfiles, ['js']);
});

gulp.task("default", ["css", "js", "watch"]);