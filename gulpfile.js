// Gulp.js build file ( Dec 26, 2016 )

var gulp = require('gulp');
var concat = require('gulp-concat');

var less = require('gulp-less');
var css = require('gulp-minify-css');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
	
	//-- Copy HTML
	gulp
		.src('./src/*.html')
		.pipe(gulp.dest('./dist'))
		
	//-- Compile LESS
	gulp
		.src('./src/*.less')
		.pipe(less())
		.pipe(css())
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./dist'))
	
	//-- Compile JS
	gulp
		.src(['./src/controllers.js', './src/directives.js', './src/services.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('app.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('./dist'))
});

//-- Watch for changes...
gulp.watch(['./src/*'], ['default']);