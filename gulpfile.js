/*
 * 
 * Определяем переменные 
 *
 */

var gulp = require('gulp'), // Сообственно Gulp JS
  uglify = require('gulp-uglify'), // Минификация JS
  concat = require('gulp-concat'), // Склейка файлов
  imagemin = require('gulp-imagemin'), // Минификация изображений
  csso = require('gulp-csso') // Минификация CSS
  htmlmin = require('gulp-htmlmin'), // Минификация HTML
  clean = require('gulp-clean'), // Очистка
  browserify = require('gulp-browserify'), // Сборка модулей
  ghPages = require('gulp-gh-pages'); // Деплой на GitHub Pages

/*
 * 
 * Создаем задачи (таски) 
 *
 */

// Задача "css". Запускается командой "gulp css"
gulp.task('css', async function () { 
  gulp.src('./src/css/*') // файл, который обрабатываем
    .pipe(csso()) // минифицируем css, полученный на предыдущем шаге
    .pipe(gulp.dest('./build/src/css/')); // результат пишем по указанному адресу
});

// Задача "html". Запускается командой "gulp html"
gulp.task('html', async function () {
  gulp.src('./*.html') // файл, который обрабатываем
    .pipe(htmlmin({ collapseWhitespace: true })) // минифицируем html, полученный на предыдущем шаге
    .pipe(gulp.dest('./build/')); // результат пишем по указанному адресу

});

// Задача "js". Запускается командой "gulp js"
gulp.task('js', async function() {    
  gulp.src([
    
    './src/js/script.js'
  ])
    .pipe(browserify())
    .pipe(uglify()) 
    .pipe(gulp.dest('./build/src/js/')); 
});

// Задача "images". Запускается командой "gulp images"
gulp.task('images', async function() {
  gulp.src('./src/assets/*') 
    .pipe(imagemin()) 
    .pipe(gulp.dest('./build/src/assets/')) 

});
gulp.task('clean', async function() {
  gulp.src('./build/*')
    .pipe(clean());
});

//gulp task build
gulp.task('build', gulp.series( 'css', 'html', 'js', 'images'));

//gul deploy to gh-pages
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

// watch
gulp.task('watch', async function() {
  gulp.watch('./src/css/*', gulp.series('css'));
  gulp.watch('./*.html', gulp.series('html'));
  gulp.watch('./src/js/*', gulp.series('js'));
  gulp.watch('./src/assets/*', gulp.series('images'));
});