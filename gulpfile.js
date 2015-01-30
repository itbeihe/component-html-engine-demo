var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    tpl2mod = require('gulp-tpl2mod');

gulp.task('tpl',function(){
    var componentName = "TabBox";
    gulp.src('src/ccomponent/'+componentName+'/*.tpl').pipe(tpl2mod({
        prefix: 'define("'+ componentName +'.tpl",function(){return ',
        suffix: '});'
    }))
    .pipe(rename(componentName+'.tpl.js'))
    .pipe(gulp.dest('src/ccomponent/'+componentName+'/'))
});

gulp.task('concat',function(){
    gulp.src('src/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest("build/"))
});

gulp.task('default',['tpl','concat']);
