/* jshint esversion: 6 */

'use strict';

/* package */
let gulp = require('gulp');

/* gulp */
let sass   = require('gulp-sass');
let rename = require('gulp-rename');
let prefix = require('gulp-autoprefixer');
let map    = require('gulp-sourcemaps');

/* sync */
let sync = require('browser-sync').create();

/* logging */
let log = require('log'); 
require('log-node')();

/* watch */
let watch = {
	html: ['**/*.html', '**/*.php',],
	scss: ['./**/src/scss/**/*.scss',],
};

/* error */
let error = (file, line, column, message) => {
	log.error(`[${line}:${column}] ${file} →  ${message}`);
};

/* task : scss */
gulp.task('scss', gulp.parallel((done) => {
	gulp.src(watch.scss, { base: '.', })
		.pipe(map.init())
		.pipe(sass({ 
			outputStyle: 'compressed',
		}).on('error', (err) => {
			error(err.relativePath, err.line, err.column, err.messageOriginal);

			done();
		}))
		.pipe(prefix({
			cascade: false,
		}))
		.pipe(map.write('.'))
		.pipe(rename(function(path) {
			path.dirname += '/../css';
		}))
		.pipe(gulp.dest(function(file) {
			return file.base;
		}))
		.pipe(sync.stream());
        
	done();
}));

/* task : watch */
gulp.task('watch', gulp.parallel((done) => {
	sync.init({ logLevel: 'silent', notify: false, });

	gulp.watch(watch.html).on('change', sync.reload);
	gulp.watch(watch.scss).on('change', gulp.parallel(['scss',]));
    
	done();
}));

/* task : default */
gulp.task('default', gulp.parallel(['watch', 'scss',], (done) => {
	log.notice('Listening for changes...');
    
	done();
}));
