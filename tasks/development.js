'use strict';

var gulp            = require('gulp'),
  watch             = require('gulp-watch'),
  autoPrefixer      = require('gulp-autoprefixer'),
  uglify            = require('gulp-uglify'),
  eslint            = require('gulp-eslint'),
  sass              = require('gulp-sass'),
  scssLint          = require('gulp-scss-lint'),
  concat            = require('gulp-concat'),
  rename            = require('gulp-rename'),
  sourceMaps        = require('gulp-sourcemaps'),
  filter            = require('gulp-filter'),
  csscomb           = require('gulp-csscomb'),
  cleanCss          = require('gulp-clean-css'),
  htmlmin           = require('gulp-htmlmin'),
  imagemin          = require('gulp-imagemin'),
  path              = require('path'),
  pngquant          = require('imagemin-pngquant'),
  rimraf            = require('rimraf'),
  browserSync       = require("browser-sync"),
  mainBowerFiles    = require("main-bower-files"),
  runSequence       = require("run-sequence"),
  rev               = require("gulp-rev"),
  revReplace        = require("gulp-rev-replace"),
  reload            = browserSync.reload;

/* path config
 =================================================================================*/
path = {
  build: {
    base: 'www/',
    html: 'www/',
    js: 'www/js/',
    style: 'www/css/',
    images: 'www/images/',
    fonts: 'www/fonts/'
  },
  src: {
    base: 'app/',
    html: 'app/*.html',
    js: ['app/*.js', 'app/js/**/*.js'],
    style: 'app/css/**/*.*',
    images: 'app/images/**/*.*',
    fonts: 'app/fonts/**/*.*'
  },
  watch: {
    base: 'app/',
    html: 'app/*.html',
    js: ['app/*.js', 'app/js/**/*.js'],
    style: 'app/css/**/*.*',
    images: 'app/images/**/*.*',
    fonts: 'app/fonts/**/*.*'
  },
  clean: './www'
};
/*=================================================================================*/

/* build
 =================================================================================*/
// html build
gulp.task('html:build', function () {
  return gulp.src(path.src.html)
    .pipe(htmlmin())
    .pipe(gulp.dest(path.build.html))
});

// vendor js build
gulp.task('vendor-js:build', function () {
  const jsFilter = filter('**/*.js');

  return gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
});

// vendor style build
gulp.task('vendor-style:build', function () {
  const cssFilter = filter('**/*.css');

  return gulp.src(mainBowerFiles())
    .pipe(cssFilter)
    .pipe(concat('vendor.min.css'))
    .pipe(cleanCss({keepBreaks: true}))
    .pipe(gulp.dest(path.build.style))
});

// vendor fonts build
gulp.task('vendor-fonts:build', function () {
  const fontFilter = filter('**/*.+(eot|svg|ttf|woff|woff2|eotf)');

  return gulp.src(mainBowerFiles())
    .pipe(fontFilter)
    .pipe(gulp.dest(path.build.fonts));
});

// js lint
gulp.task('js:lint', function () {
  return gulp.src(path.src.js)
    .pipe(eslint())
    .pipe(eslint.format())
});

// js build
gulp.task('js:build', ['js:lint'], function () {
  return gulp.src(path.src.js)
    .pipe(sourceMaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourceMaps.write('./maps'))
    .pipe(gulp.dest(path.build.js))
});

// style lint
gulp.task('style:lint', function () {
  return gulp.src(path.src.style)
    .pipe(scssLint({
      'config': './.scss-lint.yml'
    }));
});

// style build
gulp.task('style:build', ['style:lint'], function () {
  return gulp.src(path.src.style)
    .pipe(sourceMaps.init())
    .pipe(csscomb())
    .pipe(sass({
      style: 'compressed',
      errLogToConsole: true
    }))
    .pipe(autoPrefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(concat('main.min.css'))
    .pipe(cleanCss({keepBreaks: true}))
    .pipe(sourceMaps.write('./maps'))
    .pipe(gulp.dest(path.build.style))
});

// favicon build
gulp.task('favicon:build', function () {
  return gulp.src(path.src.base + '*.ico')
    .pipe(gulp.dest(path.build.base));
});

// images build
gulp.task('images:build', function () {
  return gulp.src(path.src.images)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.images));
});

// fonts build
gulp.task('fonts:build', function() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

// revision
gulp.task('revision', function () {
  gulp.src([path.build.js + 'maps/*.map', path.build.style + 'maps/*.map'])
    .pipe(gulp.dest(path.build.base + 'assets/maps/'));

  var folders = [
    path.build.js + '*.js',
    path.build.style + '*.css'
  ];

  return gulp.src(folders)
    .pipe(rev())
    .pipe(gulp.dest(path.build.base + 'assets'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(path.build.base));
});

// revision replace
gulp.task('revision-replace', function () {
  var manifest = gulp.src(path.build.base + 'rev-manifest.json');

  return gulp.src(path.build.html + '*.html')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(path.build.base));
});

// clean
gulp.task('clean', function (callback) {
  rimraf(path.clean, callback);
});

// build
gulp.task('build', function (callback) {
  runSequence(
    'vendor-js:build',
    'vendor-style:build',
    'vendor-fonts:build',
    'js:build',
    'style:build',
    'fonts:build',
    'favicon:build',
    'images:build',
    'html:build',
    'revision',
    'revision-replace',
    callback
  )
});
/*=================================================================================*/


/* watch
 =================================================================================*/
gulp.task('watch', function(){
  gulp.watch([path.watch.html], function() {
    runSequence('html:build', 'revision-replace');
  });
  gulp.watch([path.watch.style], function() {
    gulp.run('style:build');
  });
  gulp.watch([path.watch.js], function() {
    gulp.run('js:build');
  });
  gulp.watch([path.watch.images], function() {
    gulp.run('images:build');
  });
  gulp.watch([path.watch.fonts], function() {
    gulp.run('fonts:build');
  });
  gulp.watch([path.build.js + '*.js', path.build.style + '*.css'], function() {
    runSequence('html:build', 'revision', 'revision-replace');
  });
  gulp.watch([path.build.html + '*.html', path.build.base + 'images/*', path.build.base + 'fonts/*']).on('change', reload);
});
/*=================================================================================*/


/* server
 =================================================================================*/
var config = {
  server: {
    baseDir: "./www"
  },
  tunnel: true,
  host: 'localhost',
  port: 9732,
  logPrefix: "_LOG_"
};

gulp.task('server', function () {
  browserSync(config);
});
/*=================================================================================*/

/* default
 =================================================================================*/
gulp.task('default', function (callback) {
  runSequence(
    'clean',
    'build',
    'server',
    'watch',
    callback
  )
});
/*=================================================================================*/

