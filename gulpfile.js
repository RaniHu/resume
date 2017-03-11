//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');				//html压缩
var minifycss = require('gulp-minify-css');			//css压缩	
var concat = require('gulp-concat');                //文件合并
var uglify = require('gulp-uglify');				//js压缩
var rename = require('gulp-rename');				//重命名
var jshint = require('gulp-jshint');				//js检查
var smushit = require('gulp-smushit');              //压缩图片(仅png和jpg）
var cache = require('gulp-cache');					//图片压缩缓存
var clean = require('gulp-clean');					//清空文件夹
var del = require('del');                           //删除
var spritesmith = require('gulp.spritesmith');      //雪碧图
//var livereload = require('gulp-livereload');
//var browserSync = require('browser-sync').create();
//var reload      = browserSync.reload;
//var rev = require('gulp-rev');						//更改版本号






//css雪碧图
gulp.task('css-sprite', function () {
    return gulp.src('./src/img/icon/*.png')          //需要合并的图片地址
        .pipe(spritesmith({
            imgName: '../img/sprite.png',                //保存合并后图片的地址(路径是相对于输出路径（gulp.dest）)
            cssName: 'sprite.css',                      //保存合并后对于css样式的地址
            //cssFormat: 'scss',                           //保存合并后对于css样式的地址
            padding:5,                                   //合并时两个图片的间距
            //algorithm: 'binary-tree',                  //排列样式
            //cssTemplate: './src/css/scss.template.mustache',     //生成的css模板
            cssOpts: 'spriteSrc'
        }))
        .pipe(gulp.dest('./src/css'))
});


//语法检查
gulp.task('jshint', function () {
    return gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//压缩html
gulp.task('htmlmin', function () {
    var options = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src('./src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist'));
});
//压缩css
gulp.task('minifycss', function () {
    return gulp.src('./src/css/*.css')
        .pipe(concat('main.css'))    		//合并所有css到main.css
        .pipe(gulp.dest('css'))   			//输出文件夹
        .pipe(rename({suffix: '.min'}))   	//rename压缩后的文件名
        .pipe(minifycss())   				//执行压缩
        .pipe(gulp.dest('./dist/css')) 	//输出文件夹
        .pipe(gulp.dest('./src/css')); 	//输出文件夹
});

//压缩，合并 js
gulp.task('minifyjs', function () {
    return gulp.src('./src/js/*.js')
        .pipe(concat('main.js'))    		//合并所有js到main.js
        .pipe(gulp.dest('js'))      	    //输出到文件夹
        .pipe(rename({suffix: '.min'}))     //rename压缩后的文件名
        .pipe(uglify())    					//压缩
        .pipe(gulp.dest('./dist/js'))  			//输出
        .pipe(gulp.dest('./src/js'));  			//输出
});


// 压缩图片
gulp.task('minifyimg', function () {
    return gulp.src('./src/img/*')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(gulp.dest('./dist/img'));
});


//文件清理
//执行压缩前，先删除以前压缩的文件
gulp.task('clean', function () {
    return del(['./src/css/*.min.css', './dist/css/*.min.css', './css/*.css','./src/js/*.min.js', './dist/js/*.min.js','./js/*.js'])
});

/*gulp.task('rev',['revCss'],function() {
 gulp.src("./src/index.html")
 .pipe(assetRev())
 .pipe(gulp.dest('./dist'));
 });

 gulp.task('revCss',function () {
 return gulp.src('./src/css/!*.css')
 .pipe(assetRev())
 .pipe(gulp.dest('./dist/css'))
 });*/

/*gulp.task('hot',function(){
 var files = [
 './src/!**!/!*'
 ];
 browserSync.init({
 files: files,
 proxy: "http://localhost:8080/"
 });
 gulp.on("change", reload);
 })*/


//默认任务   
//压缩js需要在检查js之后操作
gulp.task('default', ['clean','jshint'], function () {
    gulp.start('css-sprite','minifyimg','minifycss', 'minifyjs', 'htmlmin');
});