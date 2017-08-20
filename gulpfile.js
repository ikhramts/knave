const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject("tsconfig.json");

gulp.task("clean", () => {
    return gulp.src("dist")
        .pipe(clean());
})

gulp.task("build", ['clean'], () => {
    return gulp.src(['src/**/*.ts', '!src/**/*.tests.ts'])
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));
});

gulp.task("default", ["build"]);