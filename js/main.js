LeelaGame = { turn: 1, players: [] };

Leela = {
    mobile: 1,
    paid:   0,
    lang:  'en',
    init:  function() {
        Leela.design.tpls   = $('#tpls');
        Leela.design.logo   = $('#logo');
        Leela.design.intro  = $('#intro-win');
        Leela.design.loader = $('<div class="loader"></div>');
        Leela.map.el        = $('#map');
        Leela.history.el    = $('#actions-steps');
        Leela.players.el    = $('#players-list');

        Leela.map.init();
        Leela.actions.init();
        Leela.history.init();
        Leela.players.init();
        Leela.design.init();
        Leela.language.init();
        Leela.adv.init();
        Leela.sound.init();
    },
    language: {
        init: function() {
            Leela.language.toggle();
        },
        translate: function(sel) {
            sel = sel || 'body';
            if (sel instanceof jQuery === false) sel = $(sel);

            sel.find('.lang:not(.lang-' + Leela.lang + ')').hide();
            sel.find('.lang-' + Leela.lang).show();

            sel.find('[data-alt_ru]').each(function() {
                var item = $(this);
                item.attr('alt', item.attr('data-alt_' + Leela.lang));
            });
            sel.find('[data-title_ru]').each(function() {
                var item = $(this);
                item.attr('title', item.attr('data-title_' + Leela.lang));
            });
            sel.find('[data-placeholder_ru]').each(function() {
                var item = $(this);
                item.attr('placeholder', item.attr('data-placeholder_' + Leela.lang));
            });
        },
        toggle: function(lang) {
            if ( ! lang) lang = Leela.lang;

            Leela.players.el.find('.nav-name').each(function() {console.log(1);
                var item = $(this),
                    pl   = item.attr('placeholder');

                if ( ! pl || pl == item.val()) {
                    item.val(item.attr('data-placeholder_' + lang)).blur();
                }
            });

            var intro_lang = Leela.design.intro.find('.lang-' + lang);
            if ( ! intro_lang.text()) {
                intro_lang.html('').append(Leela.design.loader).load('data/intro_' + lang + '.html');
            }

            Leela.lang = lang;
            Leela.language.translate();
        }
    },
    design: {
        min: 320,
        init: function() {
            Leela.design.nav('#players', '#players-btn', '#players-panel');
            Leela.design.nav('#actions', '#actions-btn', '#actions-panel');
            Leela.design.adaptive();

            var hash = window.location.href;
            if (hash.indexOf('#cell-') !== -1) {
                var arr = hash.split('-');
                $('#cell-' + arr[1]).click();
            } else {
                if ( ! LeelaGame.players[0].history.length && LeelaGame.players.length == 1) {
                    $('#intro-win').remodal().open();
                }
            }

            $(document).on('opened', '.remodal', function() {
                if (Leela.mobile) return;

                Leela.sound.voice();
                Leela.sound.record();
            });
            $(document).on('closed', '.remodal', function() {
                if (Leela.design.modal) Leela.design.modal.destroy();
                if (Leela.actions.panel.is(':hidden')) Leela.actions.btn.click();
            });

            $('#author-btn').click(function() {
                $('[data-remodal-id="about-author"]').remodal().open();
            });

            if (Leela.mobile) {
                $('#lang-toggle, .download-btn').hide();

                var sc  = document.createElement('script');
                sc.type = 'text/javascript';
                sc.src  = 'cordova.js';
                document.getElementsByTagName('body')[0].appendChild(sc);
            } else {
                var rec = '<iframe src="http://vocaroo.com/?minimal" width="525" height="480" frameborder="0"></iframe><p><small>Powered by <a href="http://vocaroo.com" title="Voice Recorder" rel="nofollow">Vocaroo Voice Recorder</a></small></p>';
                Leela.design.tpls.find('.cell-rec').append(rec);

                var sc  = document.createElement('script');
                sc.type = 'text/javascript';
                sc.src  = '//yastatic.net/es5-shims/0.0.2/es5-shims.min.js';
                document.getElementsByTagName('body')[0].appendChild(sc);

                var sc  = document.createElement('script');
                sc.type = 'text/javascript';
                sc.src  = '//yastatic.net/share2/share.js';
                document.getElementsByTagName('body')[0].appendChild(sc);
            }
        },
        nav: function(aside, btn, nav) {
            aside = $(aside);
            btn   = $(btn);
            nav   = $(nav);

            btn.click(function() {
                if (nav.hasClass('clicked')) {
                    nav.hide().removeClass('clicked');
                } else {
                    if ($(window).width() < 1366) {
                        $('.fixed-panel:not(#' + aside.attr('id') + '-panel)')
                            .hide().removeClass('clicked');
                    }
                    nav.show().addClass('clicked');
                }
            });
        },
        adaptive: function() {
            $('body').css({ 'min-width': Leela.design.min });

            $(window).resize(function() {
                var win   = $(this),
                    win_w = win.width(),
                    win_h = win.height();

                if (win_w < Leela.design.min || win_h < Leela.design.min) return;

                var map_p = Leela.map.width / Leela.map.height,
                    map_w = Math.min(win_w, Leela.map.width),
                    map_h = map_w / map_p;

                Leela.map.el.css({ width: map_w, height: map_h });
                Leela.design.logo.width(win_w);

                for (var l = LeelaGame.players.length, i = 0; i < l; i++) {
                    var player  = LeelaGame.players[i],
                        hist    = player.history,
                        cell_id = hist.length ? hist[hist.length - 1].cell_id : 68,
                        pos     = $('#cell-' + cell_id).position();

                    $('#map-player-' + player.id).css({ top: pos.top, left: pos.left });
                }

                Leela.history.el.css({ height: win_h - 430 });
            }).resize();

            Leela.actions.btn.click();
            if ($(window).width() > 1366) $('#players-btn').click();

            if ('ontouchstart' in window) Leela.map.el.addClass('touch');
        },
        tpl: function(sel, vars) {
            var clone = Leela.design.tpls.find(sel).clone(),
                tpl = $('<div />').append(clone),
                html = tpl.html(),
                reg;

            if (vars && vars.length) {
                for (var l = vars.length, i = 0; i < l; i++) {
                    reg = new RegExp('\\[' + vars[i].name + '\\]', 'g');
                    html = html.replace(reg, vars[i].value);
                }
            }
            return html;
        }
    },
    adv: {
        shown: 0,
        init: function() {
            if (Leela.mobile) return;

            Leela.adv.intrv = setInterval(function() {
                if (Leela.adv.shown) return;
                if ($('.remodal-wrapper.remodal-is-opened:visible').length) return;

                Leela.adv.shown = 1;
                clearInterval(Leela.adv.intrv);
                $('[data-remodal-id="adv-popup"]').remodal().open();
            }, 3 * 60000);
        }
    },
    sound: {
        init: function() {
            if (Leela.mobile) return;

            var ms    = document.createElement('link');
            ms.rel    = 'stylesheet';
            ms.href   = 'libs/soundmanager2/demo/bar-ui/css/bar-ui.min.css';
            document.getElementsByTagName('head')[0].appendChild(ms);

            var sc    = document.createElement('script');
            sc.type   = 'text/javascript';
            sc.async  = false;
            sc.src    = 'libs/soundmanager2/script/soundmanager2-nodebug-jsmin.js';
            document.getElementsByTagName('body')[0].appendChild(sc);

            var sc    = document.createElement('script');
            sc.type   = 'text/javascript';
            sc.async  = false;
            sc.src    = 'libs/soundmanager2/demo/bar-ui/script/bar-ui.min.js';
            sc.onload = function() {
                soundManager.setup({ url: '/libs/soundmanager2/swf/' });
                $('#actions-sound').show().click(function() {
                    $('#play-music').slideToggle();
                });

                $(document).on('closing', '.remodal', function() {
                    var time = $('#play-voice .sm2-inline-time');

                    if (time.length && time.text() != '0:00') {
                        time.text('0:00');
                        window.sm2BarPlayers[1].actions.stop();
                        soundManager.reboot();
                    }
                    $('#play-voice').hide().remove().appendTo('body');
                });
            };
            document.getElementsByTagName('body')[0].appendChild(sc);
        },
        voice: function() {
            if (Leela.mobile) return;

            var item = $('.remodal.remodal-is-opened .voice-wrap');
            if ( ! item.length) return;

            var play = $('#play-voice');
            play.find('.sm2-playlist-bd').html('<li class="selected"><a href="' + item.attr('data-url') + '">' + item.attr('data-read') + '</a></li>');
            play.remove().appendTo(item).show();
        },
        record: function() {
            var modal = $('.remodal.remodal-is-opened'),
                btn   = $('<button></button>');

            btn.addClass('cell-rec-open').click(function() {
                $(this).parent().parent().find('.cell-rec-wrap').slideToggle();
            });

            modal.find('.cell-page-head').append(btn);
            modal.find('.cell-rec-wrap').append(Leela.design.tpl('.cell-rec'));
        }
    },
    players: {
        max: 7,
        init: function() {
            Leela.players.add_btn = $('#players-add');

            if (Leela.paid) {
                Leela.players.add_btn.click(function() { Leela.players.add(); });
            } else {
                Leela.players.add_btn.hide();
            }

            Leela.players.load();
            Leela.players.next(1);
        },
        load: function(player_id) {
            if ( ! player_id) {
                var game = localStorage.getItem('LeelaGame');
                if (game) LeelaGame = JSON.parse(game);
            }

            if (LeelaGame.players.length) {
                Leela.history.fill(player_id);
            } else {
                Leela.players.add();
            }
        },
        add: function(player, no_obj, full) {
            if ( ! player) {
                player = {
                    id: LeelaGame.players.length ? LeelaGame.players[LeelaGame.players.length - 1].id + 1 : 1,
                    name: '', ava: 0, history: [], six: 0
                };
            }

            if ( ! no_obj) LeelaGame.players.push(player);

            if (full) return;

            var vars = [
                    { name: 'Id',          value: player.id },
                    { name: 'Player_name', value: player.name },
                    { name: 'Ava',         value: player.ava }
                ],
                nav_player = $(Leela.design.tpl('.nav-player:first', vars)),
                name       = nav_player.find('.nav-name');

            if ( ! player.name) {
                player.name = name.attr('placeholder');
                name.val(player.name);
            }

            name.blur(function() {
                var player_name = name.val();

                if ( ! player_name) {
                    player_name = name.attr('placeholder');
                    name.val(player_name);
                }

                $('.player-name-' + player.id).text(player_name);
                LeelaGame.players[Leela.players.get(player.id).i].name = player_name;
            });

            nav_player.find('.nav-ava').click(function() {
                Leela.players.ava(player.id);
            });

            nav_player.find('.nav-hist').click(function() {
                var player_id = $(this).parent().attr('data-id'),
                    player    = LeelaGame.players[Leela.players.get(player_id).i],
                    vars      = [
                        { name: 'Id',   value: 'history' },
                        { name: 'Data', value: Leela.design.tpl('.hist-full:first', [
                            { name: 'Player_name', value: player.name }
                        ])
                        }];

                Leela.design.modal = $(Leela.design.tpl('.remodal-tpl:first', vars));
                Leela.design.modal.find('img:first').attr('src', 'img/ava/' + player.ava + '.png');
                Leela.design.modal.removeClass('remodal-tpl').addClass('remodal').appendTo('body');
                Leela.design.modal = Leela.design.modal.remodal();
                Leela.design.modal.open();
                Leela.players.load(player_id);
            });

            nav_player.on('click', '.nav-del', function() {
                Leela.players.del(player.id);
            });

            Leela.players.el.append(nav_player);

            if ( ! player.ava) vars[2].value = Leela.players.ava(player.id);

            var map_player = $(Leela.design.tpl('.map-player:first', vars));
            map_player.click(function() {
                var hist    = LeelaGame.players[Leela.players.get(player.id).i].history,
                    cell_id = hist.length ? hist[hist.length - 1].cell_id : 68;

                $('#cell-' + cell_id).click();
            });
            Leela.map.el.append(map_player);

            if (LeelaGame.players.length > 1) {
                Leela.actions.next.show();
                Leela.players.el.find('.nav-del:first').show();
            } else {
                Leela.players.el.find('.nav-del:first').hide();
            }

            if (LeelaGame.players.length == Leela.players.max) Leela.players.add_btn.hide();
        },
        del: function(id) {
            if (LeelaGame.players.length == 1) {
                alert($('#alert-del-last').find('.lang-' + Leela.lang).text());
                return;
            }

            var player  = Leela.players.get(id),
                confirm = $('#alert-del-confirm').find('.lang-' + Leela.lang).text().replace(/\[Player_name\]/, player.name);

            if ( ! window.confirm(confirm)) return;

            if (LeelaGame.turn == id) Leela.players.next();

            LeelaGame.players.splice(player.i, 1);
            $('#nav-player-' + id + ', #map-player-' + id).remove();

            if (Leela.paid) Leela.players.add_btn.show();

            if (LeelaGame.players.length == 1) {
                Leela.players.el.find('.nav-del:first').hide();
            }

            if (LeelaGame.players.length == 1) Leela.actions.next.hide();
        },
        get: function(id) {
            for (var l = LeelaGame.players.length, i = 0; i < l; i++) {
                if (id == LeelaGame.players[i].id) {
                    LeelaGame.players[i].i = i;
                    return LeelaGame.players[i];
                }
            }
        },
        ava: function(id) {
            var nav_player = $('#nav-player-' + id + ' .nav-ava'),
                map_player = $('#map-player-' + id),
                used       = [],
                player     = Leela.players.get(id);

            for (var l = LeelaGame.players.length, i = 0; i < l; i++) {
                if (id != LeelaGame.players[i].id) {
                    used.push(LeelaGame.players[i].ava);
                }
            }

            var new_ava = 0;
            for (var i = player.ava + 1; i <= Leela.players.max; i++) {
                if ($.inArray(i, used) != -1) continue;
                new_ava = i;
                break;
            }
            if ( ! new_ava) {
                for (var i = 1; i <= Leela.players.max; i++) {
                    if ($.inArray(i, used) != -1) continue;
                    new_ava = i;
                    break;
                }
            }
            nav_player.add(map_player).removeClass('ava-' + player.ava).addClass('ava-' + new_ava);
            player.ava = new_ava;

            return player.ava;
        },
        next: function(turn_refresh) {
            if ( ! turn_refresh) {
                var max = LeelaGame.players[LeelaGame.players.length - 1].id;

                if ( ! LeelaGame.turn || LeelaGame.turn == max) {
                    LeelaGame.turn = LeelaGame.players[0].id;
                } else {
                    LeelaGame.turn = LeelaGame.players[Leela.players.get(LeelaGame.turn).i + 1].id;
                }
            }

            Leela.players.el.find('.nav-ava.rotating').removeClass('rotating');
            Leela.players.el.find('#nav-player-' + LeelaGame.turn + ' .nav-ava').addClass('rotating');

            Leela.map.el.find('.map-player.rotating').removeClass('rotating');
            Leela.map.el.find('#map-player-' + LeelaGame.turn).addClass('rotating');

            Leela.actions.nav();
        },
        move: function(value, cell_id) {
            if ($(window).width() < 1366) {
                $('.fixed-panel').hide().removeClass('clicked');
            }

            value = value * 1;
            if (cell_id) cell_id = cell_id * 1;

            var player = LeelaGame.players[Leela.players.get(LeelaGame.turn).i],
                hist   = player.history;

            if ( ! hist.length || hist[hist.length - 1].cell_id == 68) {
                if (value == 6) {
                    cell_id = 1;
                } else {
                    Leela.players.next();
                    return;
                }
            }

            var six_move = 0;
            if (value == 6) player.six++;
            if (player.six == 3 && value && value < 6) {
                alert($('#alert-six-3').find('.lang-' + Leela.lang).text());

                for (var l = hist.length - 1, i = l; i >= 0; i--) {
                    if ((hist[i].dice && hist[i].dice < 6) || ! i) {
                        cell_id = hist[i].cell_id + value;
                        six_move = 1;
                        break;
                    }
                }
            }
            if (player.six > 3 && value && value < 6) {
                alert($('#alert-six-4').find('.lang-' + Leela.lang).text());

                for (var l = hist.length - 1, i = l; i >= 0; i--) {
                    if ((hist[i].dice && hist[i].dice < 6) || ! i) {
                        cell_id = hist[i].cell_id + player.six * 6 + value;
                        six_move = 1;
                        break;
                    }
                }
            }
            if (value && value < 6) player.six = 0;

            var prev_id = hist.length ? hist[hist.length - 1].cell_id : 68;

            if (player.six > 3) {
                Leela.actions.nav();
                return;
            }

            if (cell_id > 72) cell_id = hist[hist.length - 1].cell_id;

            if ( ! cell_id) {
                cell_id = prev_id + value;

                if (cell_id > 72) {
                    if (value < 6) {
                        Leela.players.next();
                        return;
                    } else {
                        Leela.actions.nav();
                        return;
                    }
                }
            }

            if (cell_id == 68 || prev_id + value == 68) {
                var salute = $('<img src="img/salute.gif" id="salute">');
                salute
                    .add(Leela.actions.dice.el)
                    .add(Leela.actions.dice.root.find('.dice-aside button'))
                    .one('click', function() {
                        salute.remove();
                    });
                Leela.map.el.append(salute);
            }

            function moveEnd() {
                $('#cell-' + cell_id).click();

                var d = new Date();
                Leela.history.add({ player_id: player.id, dice: value, cell_id: cell_id, date: d.getTime(), six: player.six });

                if ((prev_id && prev_id == 1) || $.inArray(Leela.map.cells[cell_id - 1].type, ['arrow', 'snake']) !== -1 || player.six) {
                    Leela.actions.nav();
                } else {
                    Leela.players.next();
                }
            }

            if (cell_id == 1 || six_move || $.inArray(Leela.map.cells[prev_id - 1].type, ['birth', 'arrow', 'snake']) !== -1) {
                var cell = $('#cell-' + cell_id),
                    pos  = cell.position();

                $('#map-player-' + LeelaGame.turn).animate({ top: pos.top, left: pos.left }, 'slow', function() {
                    moveEnd();
                });
            } else {
                for (var i = prev_id + 1; i <= cell_id; i++) {
                    var cell  = $('#cell-' + i),
                        pos   = cell.position(),
                        times = prev_id + 1;

                    $('#map-player-' + LeelaGame.turn).animate({ top: pos.top, left: pos.left }, 'slow', function() {
                        if (times < cell_id) {
                            times++;
                        } else {
                            moveEnd();
                        }
                    });
                }
            }
        }
    },
    history: {
        init: function() {
            Leela.history.root = $('#actions-history');

            Leela.history.el.on('click', '.hist-cell', function() {
                $('#cell-' + $(this).attr('data-id')).click();
            });

            $(document).on('click', '.hist-step-full a', function() {
                $('#cell-' + $(this).attr('data-id')).click();
            });

            $('#hist-new').click(function() {
                if ( ! window.confirm($('#alert-hist-new').find('.lang-' + Leela.lang).text())) return;

                localStorage.removeItem('LeelaGame');
                window.location.reload(true);
            });
        },
        add: function(step, no_obj, player_id) {
            var player = LeelaGame.players[Leela.players.get(step.player_id).i],
                hist   = player.history,
                d      = new Date(step.date),
                cell   = Leela.map.cells[step.cell_id - 1],
                date   =
                    ('0' + d.getDate()).slice(-2) + '.' +
                    ('0' + (d.getMonth() + 1)).slice(-2) + ' ' +
                    ('0' + d.getHours()).slice(-2) + ':' +
                    ('0' + d.getMinutes()).slice(-2),
                vars   = [
                    { name: 'Id',           value: player.id },
                    { name: 'Player_name',  value: player.name },
                    { name: 'Hist_date',    value: date },
                    { name: 'Cell_id',      value: step.cell_id },
                    { name: 'Cell_name_ru', value: cell.name_ru },
                    { name: 'Cell_name_en', value: cell.name_en }
                ];

            if ( ! no_obj) hist.push(step);
            if (player_id) {
                var step_full = $('.remodal .hist-steps-full');
                step_full.prepend(Leela.design.tpl('.hist-step-full:first', vars));

                var step_img = step_full.find('img:first');
                step_img.attr('src', step_img.attr('data-src'));
            } else {
                if (Leela.history.root.is(':hidden')) Leela.history.root.show();
                Leela.history.el.prepend(Leela.design.tpl('.hist-step:first', vars));
            }
        },
        fill: function(player_id) {
            var steps = [];
            if (player_id) {
                var player = LeelaGame.players[Leela.players.get(player_id).i];
                Leela.players.add(player, 1, player_id);
                steps = steps.concat(player.history);
            } else {
                for (var l = LeelaGame.players.length, i = 0; i < l; i++) {
                    Leela.players.add(LeelaGame.players[i], 1, player_id);
                    steps = steps.concat(LeelaGame.players[i].history);
                }
            }
            steps.sort(Leela.history.sort);
            if (player_id) {
                steps.reverse();
                $('#history-full').html('');
            }

            var dice = 0;
            for (var l = steps.length, i = 0; i < l; i++) {
                if (steps[i].dice) dice = steps[i].dice;
                Leela.history.add(steps[i], 1, player_id);
            }

            if ( ! player_id && dice) {
                Leela.actions.dice.el.attr('class', 'dice-' + dice).attr('data-value');
            }
        },
        sort: function(a, b) {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
        },
        save: function() {
            $.post('php/save.php', 'game=' + localStorage.getItem('LeelaGame'), function(result) {
                if ( ! result) return;

                window.open('game/' + result + '.html');
            });
        }
    },
    actions: {
        init: function() {
            Leela.actions.btn       = $('#actions-btn');
            Leela.actions.panel     = $('#actions-panel');
            Leela.actions.help      = $('#actions-help');
            Leela.actions.dice.root = $('#actions-dices');
            Leela.actions.dice.el   = $('#actions-dice');
            Leela.actions.birth     = $('#actions-birth');
            Leela.actions.arrow     = $('#actions-arrow');
            Leela.actions.snake     = $('#actions-snake');
            Leela.actions.next      = $('#actions-next');
            Leela.actions.pulsate   = $('#actions-pulsate');
            Leela.actions.pay       = $('#actions-pay');

            Leela.actions.dice.root.on('click', '.dice-aside button', function() {
                Leela.actions.dice.roll($(this).attr('data-value'));
            });
            Leela.actions.dice.el.click(function() {
                Leela.actions.dice.roll();
            });
            Leela.actions.birth.click(function() {
                Leela.players.move(0, 6);
            });
            Leela.actions.next.click(function() {
                Leela.players.next();
            });
            Leela.actions.arrow.add(Leela.actions.snake).click(function() {
                var hist    = LeelaGame.players[Leela.players.get(LeelaGame.turn).i].history,
                    prev_id = hist[hist.length - 1].cell_id,
                    next_id = Leela.map.cells[prev_id - 1].goto;

                Leela.players.move(0, next_id);
            });
            Leela.actions.pay.click(function() {
                var lang = (Leela.lang == 'ru') ? '' : '_' + Leela.lang;
                window.open('https://play.google.com/store/apps/details?id=com.alexbom.leelaveda' + lang + '_full', '_blank', 'location=yes');
                return false;
            });
        },
        nav: function() {
            var player  = LeelaGame.players[Leela.players.get(LeelaGame.turn).i],
                hist    = player.history,
                length  = hist.length,
                cell_id = length ? hist[length - 1].cell_id : 68,
                type    = Leela.map.cells[cell_id - 1].type,
                spec    = ($.inArray(type, ['birth', 'arrow', 'snake']) !== -1),
                vars    = [
                    { name: 'Id',          value: player.id },
                    { name: 'Player_name', value: player.name }
                ];

            if (type == 'arrow' || type == 'snake') {
                $('#cell-' + cell_id).mouseover();
            } else {
                Leela.map.el.find('.cell').mouseout();
            }

            Leela.actions.pulsate.hide();
            if (spec) {
                Leela.actions.dice.root.hide();

                if (type == 'birth') {
                    Leela.actions.arrow.hide();
                    Leela.actions.snake.hide();
                    Leela.actions.birth.show();
                    Leela.actions.help.html(Leela.design.tpl('.help-birth:first', vars));
                }
                if (type == 'arrow') {
                    Leela.actions.birth.hide();
                    Leela.actions.snake.hide();
                    Leela.actions.arrow.show();
                    Leela.actions.pulsate.show();
                    Leela.actions.help.html(Leela.design.tpl('.help-arrow:first', vars));
                }
                if (type == 'snake') {
                    Leela.actions.arrow.hide();
                    Leela.actions.birth.hide();
                    Leela.actions.snake.show();
                    Leela.actions.pulsate.show();
                    Leela.actions.help.html(Leela.design.tpl('.help-snake:first', vars));
                }
            } else {
                Leela.actions.birth.add(Leela.actions.arrow).add(Leela.actions.snake).hide();
                Leela.actions.dice.root.show();
                Leela.actions.pulsate.show();

                if (length && hist[length - 1].cell_id == 68) {
                    Leela.actions.help.html(Leela.design.tpl('.help-win:first', vars));
                } else if ( ! length || hist[length - 1].cell_id == 68) {
                    Leela.actions.help.html(Leela.design.tpl('.help-start:first', vars));
                } else if (player.six && player.six < 3) {
                    Leela.actions.help.html(Leela.design.tpl('.help-six:first', vars));
                } else if (player.six >= 3) {
                    Leela.actions.help.html(Leela.design.tpl('.help-six-again:first', vars));
                } else {
                    Leela.actions.help.html(Leela.design.tpl('.help-dice:first', vars));
                }
            }

            Leela.actions.panel.find('button').prop('disabled', false);
            if (Leela.actions.panel.is(':hidden')) Leela.actions.btn.click();

            if (Leela.mobile) localStorage.setItem('LeelaGame', JSON.stringify(LeelaGame));

            Leela.pay.check();
        },
        dice: {
            cheat: 0,
            rand: function() {
                return Math.floor(Math.random() * 6) + 1;
            },
            roll: function(value) {
                if ( ! Leela.actions.dice.cheat && value) {
                    if ( ! window.confirm($('#alert-cheat-confirm').find('.lang-' + Leela.lang).text())) return;
                    Leela.actions.dice.cheat = 1;
                }

                Leela.actions.panel.find('button').prop('disabled', true);

                var total    = Leela.actions.dice.rand(),
                    speed    = 300,
                    fade_in  = 1,
                    fade_out = 1;

                for (var i = 0; i < total; i++) {
                    Leela.actions.dice.el
                        .animate({ opacity: 0 }, speed, function() {
                            var val = (value && fade_in == total) ? value : Leela.actions.dice.rand();

                            Leela.actions.dice.el
                                .attr('class', 'dice-' + val)
                                .attr('data-value', val);

                            fade_in++;
                        })
                        .animate({ opacity: 1 }, speed, function() {
                            if (fade_out == total) {
                                Leela.players.move(Leela.actions.dice.el.attr('data-value'));
                            }
                            fade_out++;
                        });
                }
            }
        }
    },
    pay: {
        check: function() {
            if ( ! Leela.mobile || Leela.paid) return;

            var free   = 3,
                player = LeelaGame.players[Leela.players.get(LeelaGame.turn).i],
                hist   = player.history,
                length = hist.length,
                first  = hist[length - free];

            if ( ! first) return;

            var now = new Date(),
                old = new Date(first.date);

            old.setHours(0, 0, 0, 0);

            if (old.getTime() + 24 * 60 * 60 * 1000 < now.getTime()) return;

            Leela.actions.dice.root.hide();
            Leela.actions.birth.hide();
            Leela.actions.snake.hide();
            Leela.actions.arrow.hide();
            Leela.actions.pay.stop().fadeIn();
            Leela.actions.help.html(Leela.design.tpl('.help-pay:first'));
        }
    },
    map: {
        image:  'img/map.jpg',
        width:  765,
        height: 700,
        init:   function() {
            Leela.map.el.css({
                'min-width'       : Leela.design.min,
                'min-height'      : Leela.design.min * (Leela.map.height / Leela.map.width),
                'background-image': 'url(' + Leela.map.image + ')'
             });

            for (var i = 0; i < 72; i++) {
                var item = Leela.map.cells[Leela.map.grid[i] - 1],
                 vars = [
                     { name: 'Cell_type',    value: item.type || '' },
                     { name: 'Id',           value: item.id },
                     { name: 'Cell_name_ru', value: item.name_ru },
                     { name: 'Cell_name_en', value: item.name_en }
                 ];

                Leela.map.el.append(Leela.design.tpl('.cell:first', vars));

                if (item.type == 'arrow' || item.type == 'snake') {
                    var img = $('<img src="img/guide-' + item.id + '.png" alt="" id="guide-' + item.id + '" class="map-guide trans-linear">');

                    Leela.map.el.append(img);
                    $('#cell-' + item.id).hover(
                        function() {
                            $('#guide-' + $(this).attr('data-id')).stop().fadeIn('fast');
                        },
                        function() {
                            $('#guide-' + $(this).attr('data-id')).stop().fadeOut('fast');
                        }
                    );
                }
            }

            Leela.map.el.on('click', '.cell', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var item = $(this),
                    id   = item.attr('data-id');

                $.get('data/' + id + '.html', function(data) {
                    var vars  = [
                        { name: 'Id', value: 'cell-' + id },
                        { name: 'Data', value: data }
                    ];

                    if (Leela.design.modal) Leela.design.modal.destroy();

                    Leela.design.modal = $(Leela.design.tpl('.remodal-tpl:first', vars));
                    Leela.language.translate(Leela.design.modal);

                    Leela.design.modal.removeClass('remodal-tpl').addClass('remodal').appendTo('body');
                    Leela.design.modal.find('.remodal-continue').css('background-image', 'url(img/cells/' + id + '.jpg)');
                    Leela.design.modal = Leela.design.modal.remodal();
                    Leela.design.modal.open();
                });
            });
        },
        grid: [
            72, 71, 70, 69, 68, 67, 66, 65, 64,
            55, 56, 57, 58, 59, 60, 61, 62, 63,
            54, 53, 52, 51, 50, 49, 48, 47, 46,
            37, 38, 39, 40, 41, 42, 43, 44, 45,
            36, 35, 34, 33, 32, 31, 30, 29, 28,
            19, 20, 21, 22, 23, 24, 25, 26, 27,
            18, 17, 16, 15, 14, 13, 12, 11, 10,
            1,  2,  3,  4,  5,  6,  7,  8,  9
        ],
        cells: [
            { id:  1, name_ru: 'Рождение', name_en: 'Birth', type: 'birth', goto: 6 },
            { id:  2, name_ru: 'Майа', name_en: 'Maya' },
            { id:  3, name_ru: 'Гнев', name_en: 'Anger' },
            { id:  4, name_ru: 'Жадность', name_en: 'Greed' },
            { id:  5, name_ru: 'Физический план', name_en: 'Physical Plan' },
            { id:  6, name_ru: 'Заблуждение', name_en: 'Misconception' },
            { id:  7, name_ru: 'Тщеславие', name_en: 'Vanity' },
            { id:  8, name_ru: 'Алчность', name_en: 'Avidity' },
            { id:  9, name_ru: 'Чувственный план', name_en: 'Sensual plan' },
            { id: 10, name_ru: 'Очищение', name_en: 'Purification', type: 'arrow', goto: 23 },
            { id: 11, name_ru: 'Развлечения', name_en: 'Entertainment' },
            { id: 12, name_ru: 'Зависть', name_en: 'Envy', type: 'snake', goto: 8 },
            { id: 13, name_ru: 'Ничтожность', name_en: 'Nullity' },
            { id: 14, name_ru: 'Астральный план', name_en: 'Astral plane' },
            { id: 15, name_ru: 'План фантазии', name_en: 'Fantasy plan' },
            { id: 16, name_ru: 'Ревность', name_en: 'Jealousy', type: 'snake', goto: 4 },
            { id: 17, name_ru: 'Сострадание', name_en: 'Compassion', type: 'arrow', goto: 69 },
            { id: 18, name_ru: 'План радости', name_en: 'Joy plan' },
            { id: 19, name_ru: 'План кармы', name_en: 'Karma plan' },
            { id: 20, name_ru: 'Благотворительность', name_en: 'Charity', type: 'arrow', goto: 32 },
            { id: 21, name_ru: 'Искупление', name_en: 'Redemption' },
            { id: 22, name_ru: 'План Дхармы', name_en: 'Dharma plan', type: 'arrow', goto: 60 },
            { id: 23, name_ru: 'Небесный план', name_en: 'Heavenly plan' },
            { id: 24, name_ru: 'Плохая компания', name_en: 'Bad company', type: 'snake', goto: 7 },
            { id: 25, name_ru: 'Хорошая компания', name_en: 'Good company' },
            { id: 26, name_ru: 'Печаль', name_en: 'Grief' },
            { id: 27, name_ru: 'Самоотверженное служение', name_en: 'Selfless service', type: 'arrow', goto: 41 },
            { id: 28, name_ru: 'Истинная религиозность', name_en: 'True religiosity', type: 'arrow', goto: 50 },
            { id: 29, name_ru: 'Неправедность', name_en: 'Unrighteousness', type: 'snake', goto: 6 },
            { id: 30, name_ru: 'Хорошие тенденции', name_en: 'Good trends' },
            { id: 31, name_ru: 'План святости', name_en: 'Holiness plan' },
            { id: 32, name_ru: 'План равновесия', name_en: 'Balance plan' },
            { id: 33, name_ru: 'План ароматов', name_en: 'Flavors plan' },
            { id: 34, name_ru: 'План вкуса', name_en: 'Taste plan' },
            { id: 35, name_ru: 'Чистилище', name_en: 'Purgatory' },
            { id: 36, name_ru: 'Ясность сознания', name_en: 'Mind clarity' },
            { id: 37, name_ru: 'Джняна', name_en: 'Jnana', type: 'arrow', goto: 66 },
            { id: 38, name_ru: 'Прана-лока', name_en: 'Prana-Loka' },
            { id: 39, name_ru: 'Апана-лока', name_en: 'Apana-Loka' },
            { id: 40, name_ru: 'Въяна-лока', name_en: 'Vyana-Loka' },
            { id: 41, name_ru: 'Человеческий план', name_en: 'Human plan' },
            { id: 42, name_ru: 'План Агни', name_en: 'Agni plan' },
            { id: 43, name_ru: 'Рождение человека', name_en: 'Human birth' },
            { id: 44, name_ru: 'Неведение', name_en: 'Ignorance', type: 'snake', goto: 9 },
            { id: 45, name_ru: 'Правильное знание', name_en: 'Right knowledge', type: 'arrow', goto: 67 },
            { id: 46, name_ru: 'Различение', name_en: 'Distinction', type: 'arrow', goto: 62 },
            { id: 47, name_ru: 'План нейтральности', name_en: 'Neutrality plan' },
            { id: 48, name_ru: 'Солнечный план', name_en: 'Solar plan' },
            { id: 49, name_ru: 'Лунный план', name_en: 'Moon plan' },
            { id: 50, name_ru: 'План аскетизма', name_en: 'Austerity plan' },
            { id: 51, name_ru: 'Земля', name_en: 'Earth' },
            { id: 52, name_ru: 'План насилия', name_en: 'Violence plan', type: 'snake', goto: 35 },
            { id: 53, name_ru: 'План жидкостей', name_en: 'Liquids plan' },
            { id: 54, name_ru: 'План духовной преданности', name_en: 'Spiritual devotion plan', type: 'arrow', goto: 68 },
            { id: 55, name_ru: 'Эгоизм', name_en: 'Selfishness', type: 'snake', goto: 3 },
            { id: 56, name_ru: 'План изначальных вибраций', name_en: 'Primeordial vibrations' },
            { id: 57, name_ru: 'План газов', name_en: 'Gas plan' },
            { id: 58, name_ru: 'План сияния', name_en: 'Lights plan' },
            { id: 59, name_ru: 'План реальности', name_en: 'Reality plan' },
            { id: 60, name_ru: 'Позитивный интеллект', name_en: 'Positive intelligence' },
            { id: 61, name_ru: 'Негативный интеллект', name_en: 'Negative intelligence', type: 'snake', goto: 13 },
            { id: 62, name_ru: 'Счастье', name_en: 'Happiness' },
            { id: 63, name_ru: 'Тамас', name_en: 'Tamas', type: 'snake', goto: 2 },
            { id: 64, name_ru: 'Феноменальный план', name_en: 'Phenomenal plan' },
            { id: 65, name_ru: 'План внутреннего пространства', name_en: 'Internal space plan' },
            { id: 66, name_ru: 'План блаженства', name_en: 'Bliss plan' },
            { id: 67, name_ru: 'План космического блага', name_en: 'Space benefits plan' },
            { id: 68, name_ru: 'Космическое Сознание', name_en: 'Cosmic Consciousness' },
            { id: 69, name_ru: 'План Абсолюта', name_en: 'Absolute plan' },
            { id: 70, name_ru: 'Саттвагуна', name_en: 'Sattvaguna' },
            { id: 71, name_ru: 'Раджогуна', name_en: 'Radzhoguna' },
            { id: 72, name_ru: 'Тамогуна', name_en: 'Tamoguna', type: 'snake', goto: 51 }
        ]
    }
};

// URLs to init default object actions
if (Leela.mobile || $.inArray(window.location.pathname, ['/', '/index.html', '/index.max.html']) !== -1) {
    Leela.init();
}

if (Leela.mobile) {
    // PhoneGap Build
    window.open = cordova.InAppBrowser.open;

    if (navigator.notification) {
        alert = function(message, title) {
            navigator.notification.alert(message, null, title || '', 'OK');
        }
    }
}