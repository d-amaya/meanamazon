var gulp = require("gulp");
var mocha = require("gulp-mocha");
var browserify = require("gulp-browserify");

gulp.task("test", function() {
    var error = false;
    gulp
    .src("./test/retailAppTest.js")
    .pipe(mocha())
    .on("error", function(error) {
        console.log("Testes failed!");
        console.log(error);
        error = true;
    })
    .on("end", function() {
       if (!error) {
           console.log("Tests succeeded");
       } 
    });
});

gulp.task("browserify", function() {
   return gulp.
          src("./public/javascripts/index.js").
          pipe(browserify()).
          pipe(gulp.dest("./public/javascripts/bin")); 
});

gulp.task("watch", function() {
    gulp.watch(["./test/*.js", "./routes/*.js", "./security/**/*.js",
                "./schemas/**/*.js", "./dependency/**/*.js"], ["test"]);
                
    gulp.watch(["./public/**/*.js"], ["browserify"]);                
});