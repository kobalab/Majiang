/*
 *  Majiang.Dev.AnaLogBase
 */

"use strict";

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

module.exports = class AnaLogBase {

    constructor() {
        this._result = {};
    }

    analyze(id, paipu, player_id) {

        this._id = id;
        this._player_id = player_id;
        this._ju = 0;
        this._qijia = paipu.qijia;

        for (let log of paipu.log) {
            this.log(log);
        }
    }

    log(log) {

        let qipai = log[0].qipai;
        this._jushu = qipai.zhuangfeng * 4 + qipai.jushu;
        this._jushu_name = ['東','南','西','北'][qipai.zhuangfeng]
                         + ['一','二','三','四'][qipai.jushu] + '局 '
                         + qipai.changbang + '本場';

        for (let data of log) {
            if      (data.qipai)    this.qipai   (data.qipai);
            else if (data.zimo)     this.zimo    (data.zimo);
            else if (data.dapai)    this.dapai   (data.dapai);
            else if (data.fulou)    this.fulou   (data.fulou);
            else if (data.gang)     this.gang    (data.gang);
            else if (data.gangzimo) this.gangzimo(data.gangzimo);
            else if (data.kaigang)  this.kaigang (data.kaigang);
            else if (data.hule)     this.hule    (data.hule);
            else if (data.pingju)   this.pingju  (data.pingju);
        }

        this._ju++;
    }

    qipai(qipai) {}
    zimo(zimo)   {}
    dapai(dapai) {}
    fulou(fulou) {}
    gang(gang)   {}
    gangzimo(gangzimo) {}
    kaigang(kaigang)   {}
    hule(hule)         {}
    pingju(pingju)     {}

    url(l) {
        let id = l != null ? (this._qijia + this._jushu + l) % 4 : '';
        return `${this._id}.json#/${id}/${this._ju}`;
    }

    analyze_file(filename) {

        let id, paipu;
        if (filename.match(/\.json\.gz$/)) {
            id = path.basename(filename, '.json.gz');
            paipu = JSON.parse(
                            zlib.gunzipSync(
                                fs.readFileSync(filename)
                            ).toString());
        }
        else if (filename.match(/\.json$/)) {
            id = path.basename(filename, '.json');
            paipu = JSON.parse(fs.readFileSync(filename));
        }
        else return;

        this.analyze(id, paipu);

        return this._result;
    }

    analyze_dir(dirname, n_try) {

        let logs = fs.readdirSync(dirname)
                        .filter(n=>n.match(/\.json(?:\.gz)?$/)).sort();
        if (n_try == null) n_try = logs.length;

        console.log(`[${Math.min(n_try, logs.length)}]`,
                    new Date().toTimeString());

        while (n_try && logs.length) {

            let filename = logs.shift();
            try {
                let rv = this.analyze_file(path.join(dirname, filename));
                if (! rv) continue;
            }
            catch(e) {
                console.error(`${filename}: ${e}`);
            }

            n_try--;
            if (n_try % 10000 == 0 || logs.length == 0) {
                console.log(`[${Math.min(n_try, logs.length)}]`,
                            new Date().toTimeString());
            }
        }
        return this._result;
    }

    static analyze(filename, n_try) {

        filename = filename || './';
        const analog = new this();
        if (fs.statSync(filename).isDirectory())
                analog.analyze_dir(filename, n_try);
        else    analog.analyze_file(filename);

        return analog._result;
    }
}
