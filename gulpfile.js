const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();

const srcDir = './src';
const appDir = './app';
const distDir = './dist';

// Compile SCSS into a single CSS file for app
function compileCSS() {
  return gulp.src([
    `${srcDir}/scss/main.scss`,
  ])
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(cleanCss())
    .pipe(gulp.dest(appDir));
}

const webpackConfig = (filename) => ({
  mode: 'production',
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  output: {
    filename,
    globalObject: 'this',
    library: 'AutoComplete',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  target: 'web',
});

// Compile JS file into a single ES5 JS file using Webpack and Babel for app
function compileAppJS() {
  return gulp.src(`${srcDir}/js/main.js`)
    .pipe(webpack(webpackConfig('main.js')))
    .pipe(gulp.dest(appDir));
}

// Compile JS file into a single ES5 JS file using Webpack and Babel for dist
function compileDistJS() {
  return gulp.src(`${srcDir}/js/header-search.js`)
    .pipe(webpack(webpackConfig('header-search.js')))
    .pipe(gulp.dest(distDir));
}

// Copy src files
function copySCSStoDist() {
  return gulp.src(`${srcDir}/scss/header-search.scss`)
    .pipe(gulp.dest(distDir));
}

// Default task called by running `npm start`
gulp.task('default', () => {
  // Compile CSS
  compileCSS();
  // Compile JS
  compileAppJS();

  // Start simple browsersync server
  browserSync.init({
    server: {
      baseDir: './app',
      routes: {
        '/dist': './dist',
      },
    },
  });

  // Reload server on HTML changes
  gulp.watch('app/*.html').on('change', browserSync.reload);
  // Watch src CSS and recompile on changes
  gulp.watch(`${srcDir}/scss/**/*.scss`, gulp.series([compileCSS]));
  // Watch src JS and recompile on changes
  gulp.watch(`${srcDir}/js/**/*.js`, gulp.series([compileAppJS]));
});

gulp.task('build', async (done) => {
  // Clean dist directory
  await del(distDir);
  // Compile JS
  compileDistJS();
  // Copy SCSS
  copySCSStoDist();

  return done();
});
