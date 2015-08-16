(function() {

var id = 'banner-of-peace',
    d = document,
    btn = d.createElement('div'),
    img = d.createElement('img'),
    txt = d.createElement('div'),
    css = d.createElement('style'),
    item = d.getElementById(id),
    lang = item.getAttribute('data-lang'),
    width = item.getAttribute('data-width'),
    height = item.getAttribute('data-height'),
    src = item.getAttribute('data-img'),
    txt_width = 318,
    title, info, about, code;

    lang = lang || 'ru';
    width = width || 139;
    height = height || 46;

switch (lang) {
    case 'ru':
src = src || '//leelaveda.ru/images/peace-btn.png';
title = 'Я за МИР';
about = '<br /><br /><a href="http://hram-mira.ru/button.html" target="_blank">Подробнее о кнопке</a>';
info =
'<div>'+
    '<p><a href="//ru.wikipedia.org/wiki/Знамя_Мира" target="_blank" title="Википедия о Знамеми Мира">Знамя Мира</a> &mdash; есть символ всего Мира, не одной страны, но всего цивилизованного Мира.</p>'+
    '<p>Имеет огромную древность и встречается во всем мире, потому не может быть ограничен какой-либо сектой, религией или традицией, ибо он представляет эволюцию сознания во всех ее фазах.</p>'+
    '<p id="'+id+'-author">Николай Рерих</p>'+
    '<p class="'+id+'-foot">'+
        '<a href="#" id="'+id+'-get">Поднять Знамя Мира</a>'+about+
    '</p>'+
'</div>';
code =
'<div>'+
    '<p>Разместите код Знамени Мира на вашем сайте, чтобы напоминать себе и окружающим о ценности Мира на Земле.</p>'+
    '<br>'+
    '<textarea id="'+id+'-code" title="Копировать: Ctrl + C">&lt;div id="'+id+'"&gt;&lt;/div&gt;\n&lt;script type="text/javascript" src="//leelaveda.ru/js/'+id+'.js"&gt;&lt;/script&gt;</textarea>'+
    '<p class="'+id+'-foot">'+
        '<a href="#" id="'+id+'-back">Назад</a>'+about+
    '</p>'+
'</div>';
    break;
    case 'en':
src = src || '//leelaveda.ru/images/peace-btn-en.png';
title = 'I`m Peace';
about = '<br /><br /><a href="http://hram-mira.ru/button.html" target="_blank">About the button</a>';
info =
'<div>'+
    '<p><a href="//en.wikipedia.org/wiki/Banner_of_Peace" target="_blank" title="Wikipedia about Banner of Peace">Banner of Peace</a> &mdash; a symbol around the world, not one country, but of the whole civilized world.</p>'+
    '<p>Has great antiquity and is found throughout the world, therefore can not be limited to any sect, religion or tradition, for it represents the evolution of consciousness in all its phases.</p>'+
    '<p id="'+id+'-author">Nicholas Roerich</p>'+
    '<p class="'+id+'-foot">'+
        '<br /><a href="#" id="'+id+'-get">Raise <nobr>the Banner of Peace</nobr></a>'+about+
    '</p>'+
'</div>';
code =
'<div>'+
    '<p>Be the Banner of Peace code on your site to remind ourselves and others about the value of peace on Earth.</p>'+
    '<br>'+
    '<textarea id="'+id+'-code" title="Copy: Ctrl + C">&lt;div id="'+id+'" data-lang="en"&gt;&lt;/div&gt;\n&lt;script type="text/javascript" src="//leelaveda.ru/js/'+id+'.js"&gt;&lt;/script&gt;</textarea>'+
    '<p class="'+id+'-foot"><a href="#" id="'+id+'-back">Back</a>'+about+
'</div>';
    break;
}

var styles =
'#'+id+' *{margin:0;padding:0;border:0;outline:0;vertical-align:baseline;background:transparent;font:normal 14px Arial,Tahoma,Verdana,Sans-Serif;line-height:20px}'+
'#'+id+'-btn{z-index:999999;position:relative;width:'+width+'px;height:'+height+'px}'+
'#'+id+'-img{z-index:1000000;cursor:pointer;position:absolute;width:100%;height:100%}'+
'#'+id+'-txt{z-index:1000001;position:absolute;bottom:'+height+'px;display:none;width:'+txt_width+'px;height:300px;border:6px #891721 solid;overflow:hidden;-webkit-border-radius:30px;-moz-border-radius:30px;border-radius:30px;text-shadow:none;color:#000}'+
'#'+id+':hover #'+id+'-txt,#'+id+'-txt.'+id+'-clicked{display:block}'+
'#'+id+'-txt div{padding:15px;background-color:#fff;overflow:auto}'+
'#'+id+'-txt p{margin-bottom:10px}'+
'#'+id+'-txt a,#'+id+'-code{color:#891721}'+
'#'+id+'-author{text-align:right;font-style:italic}'+
'#'+id+'-code{width:100%;height:103px;margin-bottom:12px;font-size:13px}'+
'.'+id+'-foot{margin-bottom:0!important;text-align:center}',
    clicked = function() {
        if (txt.className == id+'-clicked') {
            txt.style.display = 'none';
            txt.className = '';
        } else {
            txt.className = id+'-clicked';
        }
    },
    getinfo = function() {
        txt.innerHTML = info;
        img.onclick = function() { clicked(); };
        d.getElementById(id+'-get').onclick = function() { getcode(); return false; };
    },
    getcode = function() {
        txt.innerHTML = code;
        d.getElementById(id+'-code').onfocus = function() { this.select(); };
        d.getElementById(id+'-back').onclick = function() { getinfo(); return false; };
    };
btn.id = id+'-btn';

img.id = id+'-img';
img.src = src;
img.alt = title;

txt.id = id+'-txt';
txt.innerHTML = info;

css.type = 'text/css';
if (css.styleSheet) {
    css.styleSheet.cssText = styles;
} else if (css.innerText === '') {
    css.innerText = styles;
} else {
    css.innerHTML = styles;
}

btn.appendChild(txt);
btn.appendChild(img);
item.appendChild(css);
item.appendChild(btn);
getinfo();

})();