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
    txt_width = 308,
    txt_height = 270,
    title, info, code;

    lang = lang || 'ru';
    width = width || 139;
    height = height || 46;

switch (lang) {
    case 'ru':
src = src || '//leelaveda.ru/images/peace-btn.png';
title = 'Я за МИР';
info =
'<div>'+
    '<p>Знамя Мира &ndash; есть символ всего Мира, не одной страны, но всего цивилизованного Мира.</p>'+
    '<p id="'+id+'-author">Николай Рерих</p>'+
    '<p>Кнопка &laquo;Я за МИР&raquo; &ndash; это маяк для Интернет-путешественников, предназначенный напоминать о единстве, мире и доброте.</p>'+
    '<p class="'+id+'-foot"><a href="#" id="'+id+'-get">Поднять Знамя Мира &rarr;</a></p>'+
'</div>';
code =
'<div>'+
    '<p>HTML-код для вставки на ваш сайт:</p>'+
    '<textarea id="'+id+'-code" title="Копировать: Ctrl + C">&lt;div id="'+id+'"&gt;&lt;/div&gt;\n&lt;script src="//leelaveda.ru/js/'+id+'.js"&gt;&lt;/script&gt;</textarea>'+
    '<p id="'+id+'-about"><a href="http://hram-mira.ru/button.html" title="Откроется в новом окне" target="_blank">Подробнее о кнопке</a></p>'+
    '<p class="'+id+'-foot"><a href="#" id="'+id+'-back">&larr; Назад к описанию</a></p>'+
'</div>';
    break;
    case 'en':
src = src || '//leelaveda.ru/images/peace-btn-en.png';
title = 'I`m Peace';
info =
'<div>'+
    '<p>Banner of Peace &mdash; a symbol around the world, not one country, but of the whole civilized world.</p>'+
    '<p>Has great antiquity and is found throughout the world, therefore can not be limited to any sect, religion or tradition, for it represents the evolution of consciousness in all its phases.</p>'+
    '<p id="'+id+'-author">Nicholas Roerich</p>'+
    '<p class="'+id+'-foot">'+
        '<br /><a href="#" id="'+id+'-get">Raise <nobr>the Banner of Peace</nobr></a>'+
    '</p>'+
'</div>';
code =
'<div>'+
    '<p>Be the Banner of Peace code on your site to remind ourselves and others about the value of peace on Earth.</p>'+
    '<br>'+
    '<textarea id="'+id+'-code" title="Copy: Ctrl + C">&lt;div id="'+id+'" data-lang="en"&gt;&lt;/div&gt;\n&lt;script type="text/javascript" src="//leelaveda.ru/js/'+id+'.js"&gt;&lt;/script&gt;</textarea>'+
    '<p class="'+id+'-foot"><a href="#" id="'+id+'-back">Back</a>'+
'</div>';
    break;
}

var styles =
'#'+id+' *{margin:0;padding:0;border:0;outline:0;vertical-align:baseline;background:transparent;font:normal 14px Arial,Tahoma,Verdana,Sans-Serif;line-height:20px}'+
'#'+id+'-btn{z-index:999;position:relative;width:'+width+'px;height:'+height+'px}'+
'#'+id+'-img{z-index:1000;cursor:pointer;position:absolute;width:100%;height:100%}'+
'#'+id+'-txt{z-index:1001;position:absolute;bottom:'+height+'px;display:none;width:'+txt_width+'px;height:'+txt_height+'px;background-color:#fff;border:6px #891721 solid;overflow:hidden;-webkit-border-radius:30px;-moz-border-radius:30px;border-radius:30px;text-shadow:none;color:#000}'+
'#'+id+'-txt div{padding:15px;overflow:auto}'+
'#'+id+'-txt p{margin-bottom:10px}'+
'#'+id+'-txt a,#'+id+'-code{color:#891721}'+
'#'+id+'-author{text-align:right;font-style:italic}'+
'#'+id+'-code{resize:none;width:265px;height:103px;padding:5px;border:1px #ccc solid;font-size:13px}'+
'#'+id+'-about{margin-top:10px;text-align:center}'+
'#'+id+'-about a{font-size:13px;color:#999}'+
'.'+id+'-foot{position:absolute;bottom:18px;width:280px;text-align:center}',
    clicked = function() {
        txt.style.display = (txt.style.display == 'block') ? 'none' : 'block';
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