const { src, dest, parallel, series, watch } = require('gulp'),
  browserSync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify-es').default,
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleancss = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  newer = require('gulp-newer'),
  del = require('del')

const browsersync = () => {
  browserSync.init({
    server: { baseDir: 'src/' },
    notify: false,
    online: false
  })
}

const html = () => {
  return src([
    'src/index.pug'
  ])
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('src/'))
    .pipe(browserSync.stream())
}

const styles = () => {
  return src([
    'node_modules/normalize.css/normalize.css',
    'src/index.scss'
  ])
    .pipe(sass())
    .pipe(concat('bundle.min.css'))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        grid: true
      })
    )
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } }
      })
    )
    .pipe(dest('src/css/'))
    .pipe(browserSync.stream())
}

const scripts = () => {
  return src([
    'src/js/index.js'
  ])
    .pipe(concat('bundle.min.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest('src/js/'))
    .pipe(browserSync.stream())
}

const images = () => {
  return src('src/images/**/*')
    .pipe(newer('src/images/'))
    .pipe(imagemin())
    .pipe(dest('src/images/'))
}

const cleanimg = () => {
  return del('src/images/**/*', { force: true })
}

const cleandist = () => {
  return del('dist/**/*', { force: true })
}

const buildcopy = () => {
  return src(
    [
      'src/css/**/*.min.css',
      'src/js/**/*.min.js',
      'src/images/**/*',
      'src/**/*.html'
    ],
    { base: 'src/' }
  )
    .pipe(dest('dist'))
}

const startWatch = () => {
  watch('src/**/*.pug', html).on('change', browserSync.reload)
  watch('src/**/*.scss', styles)
  watch(['src/**/*.js', '!src/**/*.min.js'], scripts)
  watch('src/images/**/*', images)
}

exports.browsersync = browsersync
exports.html = html
exports.scripts = scripts
exports.styles = styles
exports.images = images
exports.cleanimg = cleanimg
exports.cleandist = cleandist

exports.build = series(
  cleandist,
  styles,
  scripts,
  images,
  buildcopy
)

exports.default = parallel(
  html,
  styles,
  scripts,
  browsersync,
  startWatch
)
