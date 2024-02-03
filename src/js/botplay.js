/*!
 *  電脳麻将: ボット対戦 v2.0.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;

const base = location.pathname.replace(/\/[^\/]*?$/,'');

let loaded;

$(function(){

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const file = new Majiang.UI.PaipuFile($('#file'), 'Majiang.netplay');

    const player = new Majiang.AI();                                // for DEBUG
    player.view  = new Majiang.UI.Board($('#board .board'), pai, audio,
                                        player.model);

    let sock, myuid;

    function init() {

        sock = io('/', { path: `${base}/server/socket.io/`});
        sock.onAny(console.log);                                    // for DEBUG

        sock.on('HELLO', (user)=>{
            if (! user) {
                $('body').attr('class','title');
                show($('#title .login'));
            }
            else {
                myuid = user.uid;
                sock.off('disconnect').on('disconnect', ()=>{
                    hide($('#file .netplay form'));
                });
                sock.off('ERROR').on('ERROR', file.error);
                sock.off('ROOM').on('ROOM', room);
                sock.on('BOT', (no)=>sock.emit('ROOM', no));        // for DEBUG

                show($('#file .netplay form'));
                fadeIn($('body').attr('class','file'));
                if (user.icon)
                    $('#file .netplay img').attr('src', user.icon)
                                           .attr('title', user.uid);
                $('#file .netplay .name').text(user.name);
                file.redraw();
            }
        });

        sock.on('END', end);

        hide($('#title .loading'));
    }

    let row, src;

    function room(msg) {
        if (! row) {
            row = $('#room .user').eq(0);
            src = $('img', row).attr('src');
        }
        $('body').attr('class','room');
        $('#room input[name="room"]').val(msg.room_no);
        $('#room .room').empty();
        for (let user of msg.user) {
            let r = row.clone();
            if (user.icon) $('img', r).attr('src', user.icon)
                                      .attr('title', user.uid);
            else           $('img', r).attr('src', src);
            $('.name', r).text(user.name);
            if (user.offline) r.addClass('offline');
            else              r.removeClass('offline');
            $('#room .room').append(r);
        }
        if (msg.user[0].uid == myuid) show($('#room input[type="submit"]'));
        else                          hide($('#room input[type="submit"]'));
        sock.off('BOT');                                            // for DEBUG
        sock.off('START').on('START', start);
    }

    function start() {
        $('body').attr('class','board');
        scale($('#board'), $('#space'))
        sock.off('ROOM');
        sock.off('GAME').on('GAME', (msg)=>{
            if (msg.say) {
                player._view.say(msg.say.name, msg.say.l);
            }
            else if (msg.seq) {
                let wait = (msg.kaiju || msg.hule || msg.pingju || msg.jieju)
                                ? 3000 : 0;                         // for DEBUG
                player.action(msg, (reply = {})=>{
                    reply.seq = msg.seq;
                    setTimeout(()=>sock.emit('GAME', reply), wait); // for DEBUG
                });
            }
            else {
                player.action(msg);
                if (msg.kaiju && msg.kaiju.log) {
                    let log = msg.kaiju.log.pop();
                    for (let data of log) {
                        player.action(data);
                    }
                }
            }
        });
    }

    function end(paipu) {
        if (paipu) file.add(paipu, 10);
        fadeIn($('body').attr('class','file'));
        file.redraw();
        sock.off('ROOM').on('ROOM', room);
        $('#file input[name="room"]').val('');
        sock.on('BOT', (no)=>sock.emit('ROOM', no));                // for DEBUG
    }

    $('#file .netplay form').on('submit', (ev)=>{
        let room = $('input[name="room"]', $(ev.target)).val();
        sock.emit('ROOM', room);
        return false;
    });
    $('#room form').on('submit', (ev)=>{
        let room = $('input[name="room"]', $(ev.target)).val();
        sock.emit('ROOM', room);
        return false;
    });

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    $(window).on('load', ()=>setTimeout(init, 500));
    if (loaded) $(window).trigger('load');
});
$(window).on('load', ()=> loaded = true);
