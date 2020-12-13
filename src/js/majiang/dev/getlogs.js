/*
 *  getlogs
 */
"use strict";

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

function* get_logs_in_file(filename) {

    let basename, paipu_list;
    if (filename.match(/\.json\.gz$/)) {
        basename = path.basename(filename, '.gz');
        paipu_list = JSON.parse(zlib.gunzipSync(
                                fs.readFileSync(filename)).toString());
    }
    else if (filename.match(/\.json$/)) {
        basename = path.basename(filename);
        paipu_list = JSON.parse(fs.readFileSync(filename));
    }
    else return;

    let n = 0;
    for (let paipu of [].concat(paipu_list)) {
        yield { basename: `${basename}#${n++}`, paipu: paipu };
    }
}

function* get_files_in_dir(dirname) {
    let logs = fs.readdirSync(dirname)
                    .filter(n=>n.match(/\.json(?:\.gz)?$/)).sort();
    for (let filename of logs) {
        yield* get_logs_in_file(path.join(dirname, filename));
    }
}

function* getlogs(filename) {
    if (fs.statSync(filename).isDirectory()) yield* get_files_in_dir(filename);
    else                                     yield* get_logs_in_file(filename);
}

module.exports = getlogs;
