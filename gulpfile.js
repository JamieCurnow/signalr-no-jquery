const path = require('path');
const { EOL } = require('os');
const { fileURLToPath } = require('url');
const { createRequire } = require('module');

const gulp = require('gulp');

const pipeline = require('gulp-pipe');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const header = require('gulp-header');
const footer = require('gulp-footer');
const replace = require('gulp-replace');
const swc = require('gulp-swc');

const getPackageDir = packageName => path.dirname(require.resolve(`${packageName}/package.json`));

const srcDir = path.join(__dirname, 'src');

const destDir = path.join(__dirname, 'lib');

const tempDir = path.join(__dirname, 'tmp');

const signalRDestName = 'signalR.js';

const signalRPath = path.join(getPackageDir('signalr'), 'jquery.signalR.js');

const shimPath = path.join(srcDir, 'jQueryShim.js');

const signalRTmpPath = path.join(tempDir, signalRDestName);

const clearTempDir = () => pipeline([gulp.src(tempDir, { read: false, allowEmpty: true }), clean()]);

const clearDestDir = () => pipeline([gulp.src(tempDir, { read: false, allowEmpty: true }), clean()]);

const getSignalR = () => pipeline([gulp.src(signalRPath), rename(signalRDestName), gulp.dest(tempDir)]);

const swcPipe = (moduleType = 'es6') =>
    swc({
        module: {
            type: moduleType,
        },
    });

const mutatePipes = (moduleType = 'es6') => [
    header(`import jQueryShim from './jQueryShim.${moduleType === 'commonjs' ? 'cjs' : 'js'}';` + EOL),
    replace('window.jQuery', 'jQueryShim'),
    footer(EOL + 'export const hubConnection = jQueryShim.hubConnection;' + EOL + 'export const signalR = jQueryShim.signalR;' + EOL),
];

const renameExtToCommonJs = () =>
    rename(path => {
        path.extname = '.cjs';
    });

const buildSignalR = () => pipeline([gulp.src(signalRTmpPath), ...mutatePipes(), swcPipe(), gulp.dest(destDir)]);

const buildSignalRCommonJs = () =>
    pipeline([gulp.src(signalRTmpPath), ...mutatePipes('commonjs'), swcPipe('commonjs'), renameExtToCommonJs(), gulp.dest(destDir)]);

const copyShim = () => pipeline([gulp.src(shimPath), swcPipe(), gulp.dest(destDir)]);

const copyShimCommonJs = () => pipeline([gulp.src(shimPath), swcPipe('commonjs'), renameExtToCommonJs(), gulp.dest(destDir)]);

const copyTypings = () => pipeline([gulp.src(`${srcDir}/signalR.d.ts`), gulp.dest(destDir)]);

const build = gulp.series(clearTempDir, getSignalR, buildSignalR, buildSignalRCommonJs, clearTempDir);
exports.build = build;

exports.default = gulp.series(clearDestDir, build, copyShim, copyShimCommonJs, copyTypings);
