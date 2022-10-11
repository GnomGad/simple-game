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
  htmlmin = require('gulp-htmlmin') // Минификация HTML

/*
 * 
 * Создаем задачи (таски) 
 *
 */

// Задача "sass". Запускается командой "gulp sass"
gulp.task('css', async function () { 
  gulp.src('./style.css') // файл, который обрабатываем
    .pipe(csso()) // минифицируем css, полученный на предыдущем шаге
    .pipe(gulp.dest('./build/')); // результат пишем по указанному адресу
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
    './script.js',
  ]) 
    .pipe(uglify()) 
    .pipe(gulp.dest('./build/')) 
});

// Задача "images". Запускается командой "gulp images"
gulp.task('images', async function() {
  gulp.src('./assets/*') 
    .pipe(imagemin()) 
    .pipe(gulp.dest('./build/assets/')) 

});

// watch
gulp.task('watch', async function() {
  gulp.watch('./style.css', gulp.series('css'));
  gulp.watch('./*.html', gulp.series('html'));
  gulp.watch('./script.js', gulp.series('js'));
  gulp.watch('./assets/*', gulp.series('images'));
});