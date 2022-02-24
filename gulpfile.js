"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const del = require("del");
const cleanCss = require("gulp-clean-css");
const minify = require("gulp-minify");
const spritesmith = require("gulp.spritesmith");

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
    .pipe(sass().on("error", sass.logError))
    //.pipe(cleanCss())
    .pipe(gulp.dest("./css"));
  gulp.src('./css/*.css')
  .pipe(cleanCss())
  .pipe(concat('styles.min.css'))
  .pipe(gulp.dest("./css"));
  cb();
}

function buildJs(cb) {
  console.log("Building JS files.");
   gulp.src(["assets/js/*.js"])
    .pipe(concat("bundle.js"))
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

function buildSprites(cb) {
  var spriteData = gulp.src("./assets/icons/*.png").pipe(
    spritesmith({
      /* this whole image path is used in css background declarations */
      imgName: "sprite.png",
      cssName: "sprite.css",
    })
  );
  spriteData.img.pipe(gulp.dest("images"));
  spriteData.css.pipe(gulp.dest("css"));
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
  buildSprites(cb);
  buildJs(cb);
  buildStyles(cb);
});

exports.default = buildStyles;
