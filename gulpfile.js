"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const del = require("del");
const cleanCss = require("gulp-clean-css");
const minify = require("gulp-minify");

function clean(cb) {
  //Write code to clear the compiled folders.
  console.log("Cleanup generated files.");
  del(['./css', './js/bundle']);
  cb();
}

// Build final minified css file.
function buildStyles(cb) {
  console.log("Creating styles.");
  gulp
    .src("./assets/scss/main.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(cleanCss())
    .pipe(gulp.dest("./css"));
  cb();
}

function buildJs(cb) {
  console.log('Building JS files.');
   gulp.src(['assets/js/*.js'])
    .pipe(concat('bundle.js'))
    .pipe(
      minify({
        ext: {
          min: ".js",
        },
        noSource: true,
      })
    ).pipe(gulp.dest("js/bundle"));
  cb();
}



function watchSass(cb) {
  clean(cb);
  buildStyles(cb);
  console.log("Watching SASS changes");
  gulp.watch(["./assets/scss/*.scss", "./assets/scss/**/*.scss"], buildStyles);
}

gulp.task(clean);
gulp.task('watch', watchSass);
gulp.task("build", function(cb) {
  console.log('Building files.');
  buildJs(cb);
  buildStyles(cb);

});

exports.default = buildStyles;
