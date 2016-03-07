var gulp = require("gulp");
var mocha = require("gulp-mocha");

gulp.task("test", function() {
    var error = false;
    gulp
    .src("./test/test1.js")
    .pipe(mocha())
    .on("error", function() {
        console.log("Testes failed!");
        error = true;
    })
    .on("end", function() {
       if (!error) {
           console.log("Tests succeeded");
       } 
    });
});

gulp.task("watch", function() {
    gulp.watch(["./test/*.js", "./routes/*.js"], ["test"]);
});