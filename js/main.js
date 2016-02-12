LeelaGame = { turn : 1, players: [] };

Leela = {
    mobile: 1,
    init: function() {
        Leela.design.tpls = $('#tpls');
        Leela.history.el  = $('#actions-steps');
        Leela.design.logo = $('#logo');
        Leela.map.el      = $('#map');
        Leela.players.el  = $('#players-list');

        Leela.map.init();
        Leela.actions.init();
        Leela.history.init();
        Leela.players.init();
        Leela.design.init();
        Leela.sound.init();
    },
    design: {
        min: 320,
        init: function() {
            Leela.design.nav('#players', '#players-btn', '#players-panel');
            Leela.design.nav('#actions', '#actions-btn', '#actions-panel');

            $('#author-btn').click(function() {
                $('[data-remodal-id="about-author"]').remodal().open();

                if (Leela.mobile) return;

                $('#donation').html('<h2>Богатство щедрого неисчерпаемо</h2><br><div id="ya-donate"><iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/donate.xml?account=41001427090185&quickpay=donate&payment-type-choice=on&mobile-payment-type-choice=on&default-sum=&targets=%D0%94%D0%BE%D0%B1%D1%80%D0%BE%D0%B2%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5+%D0%BF%D0%BE%D0%B6%D0%B5%D1%80%D1%82%D0%B2%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F+%D0%BD%D0%B0+%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5+%D0%B8%D0%B3%D1%80%D1%8B&target-visibility=on&project-name=%D0%98%D0%B3%D1%80%D0%B0+%D0%9B%D0%B8%D0%BB%D0%B0&project-site=http%3A%2F%2Fleelaveda.ru&button-text=01&successURL=http%3A%2F%2Fleelaveda.ru" width="524" height="117"></iframe></div><br>');
            });

            Leela.design.adaptive();

            var hash = window.location.href;
            if (hash.indexOf('#cell-') !== -1) {
                var arr = hash.split('-');
                $('#cell-' + arr[1]).click();
            } else {
                if ( ! LeelaGame.players[0].history.length && LeelaGame.players.length == 1) {
                    $('[data-remodal-id="intro"]').remodal().open();
                }
            }

            $(document).on('opened', '.remodal', function() {
                Leela.sound.voice();

                if (Leela.mobile) return;

                $('.remodal.remodal-is-opened .cell-rec-open').show();
            });
            $(document).on('closed', '.remodal', function() {
                if (Leela.design.modal) Leela.design.modal.destroy();
                if (Leela.actions.panel.is(':hidden')) Leela.actions.btn.click();
            });

            if (Leela.mobile) return;

            var sc  = document.createElement('script');
            sc.type = 'text/javascript';
            sc.src  = '//yandex.st/share/share.js';
            document.getElementsByTagName('body')[0].appendChild(sc);

            var sc  = document.createElement('script');
            sc.type = 'text/javascript';
            sc.src  = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.getElementsByTagName('body')[0].appendChild(sc);
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
                tpl   = $('<div />').append(clone),
                html  = tpl.html(),
                reg;

            for (var l = vars.length, i = 0; i < l; i++) {
                reg  = new RegExp('\\[' + vars[i].name + '\\]', 'g');
                html = html.replace(reg, vars[i].value);
            }
            return html;
        }
    },
    sound: {
        init: function() {
            if (Leela.mobile) return;

            var ms  = document.createElement('link');
            ms.rel  = 'stylesheet';
            ms.href = 'libs/soundmanager2/demo/bar-ui/css/bar-ui.min.css';
            document.getElementsByTagName('head')[0].appendChild(ms);

            var sc  = document.createElement('script');
            sc.type = 'text/javascript';
            sc.src  = 'soundmanager2/script/soundmanager2-nodebug-jsmin.js';
            document.getElementsByTagName('body')[0].appendChild(sc);

            var sc    = document.createElement('script');
            sc.type   = 'text/javascript';
            sc.src    = 'soundmanager2/demo/bar-ui/script/bar-ui.min.js';
            sc.onload = function() {
                soundManager.setup({ url: '/soundmanager2/swf/' });
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
        }
    },
    players: {
        max: 7,
        init: function() {
            Leela.players.add_btn = $('#players-add');
            Leela.players.add_btn.click(function() { Leela.players.add(); });
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
                    { name: 'Id',    value: player.id },
                    { name: 'Pname', value: player.name },
                    { name: 'Ava',   value: player.ava }
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
                            { name: 'Pname', value: player.name }
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

            if (LeelaGame.players.length > 1) Leela.actions.next.show();
            if (LeelaGame.players.length == Leela.players.max) Leela.players.add_btn.hide();
        },
        del: function(id) {
            if (LeelaGame.players.length == 1) {
                alert($('#alert-del-last').text());
                return;
            }

            var player  = Leela.players.get(id),
                confirm = $('#alert-del-confirm').text().replace(/\[Pname\]/, player.name);

            if ( ! window.confirm(confirm)) return;

            if (LeelaGame.turn == id) Leela.players.next();

            LeelaGame.players.splice(player.i, 1);
            $('#nav-player-' + id + ', #map-player-' + id).remove();
            Leela.players.add_btn.show();

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
                alert($('#alert-six-3').text());

                for (var l = hist.length - 1, i = l; i >= 0; i--) {
                    if ((hist[i].dice && hist[i].dice < 6) || ! i) {
                        cell_id = hist[i].cell_id + value;
                        six_move = 1;
                        break;
                    }
                }
            }
            if (player.six > 3 && value && value < 6) {
                alert($('#alert-six-4').text());

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
                salute.add(Leela.actions.dice.el).add(Leela.actions.dice.root.find('.dice-aside button')).one('click', function() {
                    salute.fadeOut('fast', function() { salute.remove(); });
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
                if ( ! window.confirm($('#alert-hist-new').text())) return;

                localStorage.removeItem('LeelaGame');
                window.location.reload(true);
            });
        },
        add: function(step, no_obj, player_id) {
            var player = LeelaGame.players[Leela.players.get(step.player_id).i],
                hist   = player.history,
                d      = new Date(step.date),
                date   =
                    ('0' + d.getDate()).slice(-2) + '.' +
                    ('0' + (d.getMonth() + 1)).slice(-2) + ' ' +
                    ('0' + d.getHours()).slice(-2) + ':' +
                    ('0' + d.getMinutes()).slice(-2),
                vars   = [
                    { name: 'Id',        value: player.id },
                    { name: 'Pname',     value: player.name },
                    { name: 'Date',      value: date },
                    { name: 'Cell_id',   value: step.cell_id },
                    { name: 'Cell_name', value: Leela.map.cells[step.cell_id - 1].name }
                ];

            if ( ! no_obj) hist.push(step);
            if (player_id) {
                $('.remodal .hist-steps-full').prepend(Leela.design.tpl('.hist-step-full:first', vars));
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
        },
        nav: function() {
            var player  = LeelaGame.players[Leela.players.get(LeelaGame.turn).i],
                hist    = player.history,
                cell_id = hist.length ? hist[hist.length - 1].cell_id : 68,
                type    = Leela.map.cells[cell_id - 1].type,
                spec    = ($.inArray(type, ['birth', 'arrow', 'snake']) !== -1),
                vars    = [
                    { name: 'Id',    value: player.id },
                    { name: 'Pname', value: player.name }
                ];

            if (spec) {
                Leela.actions.dice.root.prop('disabled', true).fadeOut('slow');

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
                    Leela.actions.help.html(Leela.design.tpl('.help-arrow:first', vars));
                }
                if (type == 'snake') {
                    Leela.actions.arrow.hide();
                    Leela.actions.birth.hide();
                    Leela.actions.snake.show();
                    Leela.actions.help.html(Leela.design.tpl('.help-snake:first', vars));
                }
            } else {
                Leela.actions.birth.add(Leela.actions.arrow).add(Leela.actions.snake).prop('disabled', true).fadeOut('slow');
                Leela.actions.dice.root.fadeIn('slow');

                if (hist.length && hist[hist.length - 1].cell_id == 68) {
                    Leela.actions.help.html(Leela.design.tpl('.help-win:first', vars));
                } else if ( ! hist.length || hist[hist.length - 1].cell_id == 68) {
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
            localStorage.setItem('LeelaGame', JSON.stringify(LeelaGame));
        },
        dice: {
            cheat: 0,
            rand: function() {
                return Math.floor(Math.random() * 6) + 1;
            },
            roll: function(value) {
                if ( ! Leela.actions.dice.cheat && value) {
                    if ( ! window.confirm($('#alert-cheat-confirm').text())) return;
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
    map: {
        image:  'img/map.jpg',
        width:  765,
        height: 700,
        init:   function() {
            /*Leela.map.el.css({
             'min-width'       : Leela.design.min,
             'min-height'      : Leela.design.min * (Leela.map.height / Leela.map.width),
             'background-image': 'url(' + Leela.map.image + ')'
             });

             for (var i = 0; i < 72; i++) {
             var item = Leela.map.cells[Leela.map.grid[i] - 1],
             vars = [
             { name: 'Type', value: item.type || '' },
             { name: 'Id',   value: item.id },
             { name: 'Cell_name', value: item.name }
             ];

             Leela.map.el.append(Leela.design.tpl('.cell:first', vars));
             }*/

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
                    Leela.design.modal.removeClass('remodal-tpl').addClass('remodal').appendTo('body');
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
            { id:  1, name: 'Рождение', type: 'birth', goto: 6 },
            { id:  2, name: 'Майа' },
            { id:  3, name: 'Гнев' },
            { id:  4, name: 'Жадность' },
            { id:  5, name: 'Физический план' },
            { id:  6, name: 'Заблуждение' },
            { id:  7, name: 'Тщеславие' },
            { id:  8, name: 'Алчность' },
            { id:  9, name: 'Чувственный план' },
            { id: 10, name: 'Очищение', type: 'arrow', goto: 23 },
            { id: 11, name: 'Развлечения' },
            { id: 12, name: 'Зависть', type: 'snake', goto: 8 },
            { id: 13, name: 'Ничтожность' },
            { id: 14, name: 'Астральный план' },
            { id: 15, name: 'План фантазии' },
            { id: 16, name: 'Ревность', type: 'snake', goto: 4 },
            { id: 17, name: 'Сострадание', type: 'arrow', goto: 69 },
            { id: 18, name: 'План радости' },
            { id: 19, name: 'План кармы' },
            { id: 20, name: 'Благотворительность', type: 'arrow', goto: 32 },
            { id: 21, name: 'Искупление' },
            { id: 22, name: 'План Дхармы', type: 'arrow', goto: 60 },
            { id: 23, name: 'Небесный план' },
            { id: 24, name: 'Плохая компания', type: 'snake', goto: 7 },
            { id: 25, name: 'Хорошая компания' },
            { id: 26, name: 'Печаль' },
            { id: 27, name: 'Самоотверженное служение', type: 'arrow', goto: 41 },
            { id: 28, name: 'Истинная религиозность', type: 'arrow', goto: 50 },
            { id: 29, name: 'Неправедность', type: 'snake', goto: 6 },
            { id: 30, name: 'Хорошие тенденции' },
            { id: 31, name: 'План святости' },
            { id: 32, name: 'План равновесия' },
            { id: 33, name: 'План ароматов' },
            { id: 34, name: 'План вкуса' },
            { id: 35, name: 'Чистилище' },
            { id: 36, name: 'Ясность сознания' },
            { id: 37, name: 'Джняна', type: 'arrow', goto: 66 },
            { id: 38, name: 'Прана-лока' },
            { id: 39, name: 'Апана-лока' },
            { id: 40, name: 'Въяна-лока' },
            { id: 41, name: 'Человеческий план' },
            { id: 42, name: 'План Агни' },
            { id: 43, name: 'Рождение человека' },
            { id: 44, name: 'Неведение', type: 'snake', goto: 9 },
            { id: 45, name: 'Правильное знание', type: 'arrow', goto: 67 },
            { id: 46, name: 'Различение', type: 'arrow', goto: 62 },
            { id: 47, name: 'План нейтральности' },
            { id: 48, name: 'Солнечный план' },
            { id: 49, name: 'Лунный план' },
            { id: 50, name: 'План аскетизма' },
            { id: 51, name: 'Земля' },
            { id: 52, name: 'План насилия', type: 'snake', goto: 35 },
            { id: 53, name: 'План жидкостей' },
            { id: 54, name: 'План духовной преданности', type: 'arrow', goto: 68 },
            { id: 55, name: 'Эгоизм', type: 'snake', goto: 3 },
            { id: 56, name: 'План изначальных вибраций' },
            { id: 57, name: 'План газов' },
            { id: 58, name: 'План сияния' },
            { id: 59, name: 'План реальности' },
            { id: 60, name: 'Позитивный интеллект' },
            { id: 61, name: 'Негативный интеллект', type: 'snake', goto: 13 },
            { id: 62, name: 'Счастье' },
            { id: 63, name: 'Тамас', type: 'snake', goto: 2 },
            { id: 64, name: 'Феноменальный план' },
            { id: 65, name: 'План внутреннего пространства' },
            { id: 66, name: 'План блаженства' },
            { id: 67, name: 'План космического блага' },
            { id: 68, name: 'Космическое Сознание' },
            { id: 69, name: 'План Абсолюта' },
            { id: 70, name: 'Саттвагуна' },
            { id: 71, name: 'Раджогуна' },
            { id: 72, name: 'Тамогуна', type: 'snake', goto: 51 }
        ]
    }
};
Leela.init();

// PhoneGap Build
if (navigator.notification) {
    alert = function(message, title) {
        navigator.notification.alert(message, null, title || '', 'OK');
    }
}