<?php ob_start(); ?>

<!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6" lang="ru"><![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="ru"><![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="ru"><![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="ru"><!--<![endif]-->

<head>

    <meta charset="utf-8">

    <title><?=$title?></title>
    <meta name="description" content="<?=$descr?>">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <base href="/">
    <link rel="stylesheet" href="../_main.css">
    <link rel="shortcut icon" href="../img/favicon/favicon.ico" type="image/x-icon">
    <!--link rel="apple-touch-icon" href="img/favicon/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="72x72" href="img/favicon/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="114x114" href="img/favicon/apple-touch-icon-114x114.png"-->

</head>
<body>

<div style="max-width:800px;margin:0 auto;padding:50px;background-color:rgba(0, 0, 0, .8);font-size:120%;">
    <?=$body?>
    <h2><a href="http://leelaveda.ru">Игра Лила</a></h2>
</div>

<!--noindex-->
<script>
    var scr = {"scripts":[
        {"src" : "libs/jquery/jquery-1.11.2.min.js", "async" : false}
        <?=$js?>
    ]};!function(t,n,r){"use strict";var c=function(t){if("[object Array]"!==Object.prototype.toString.call(t))return!1;for(var r=0;r<t.length;r++){var c=n.createElement("script"),e=t[r];c.src=e.src,c.async=e.async,n.body.appendChild(c)}return!0};t.addEventListener?t.addEventListener("load",function(){c(r.scripts);},!1):t.attachEvent?t.attachEvent("onload",function(){c(r.scripts)}):t.onload=function(){c(r.scripts)}}(window,document,scr);
</script>

<!-- Google counter --><script type="text/javascript">var _gaq=_gaq||[];_gaq.push(["_setAccount","UA-37002052-1"]),_gaq.push(["_trackPageview"]),function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();</script>
<!-- Yandex counter --><script type="text/javascript">(function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter18802999 = new Ya.Metrika({id:18802999, webvisor:true, clickmap:true, trackLinks:true, accurateTrackBounce:true, trackHash:true}); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");</script><noscript><div><img src="//mc.yandex.ru/watch/18802999" style="position:absolute; left:-9999px;" alt=""></div></noscript>
<!--/noindex-->

</body>
</html>

<?php
$out = ob_get_contents();
ob_end_clean();

$out = str_replace("\n", '', $out);
$out = preg_replace('/\s+/', ' ', $out);
$out = str_replace('> <', '><', $out);
$out = trim($out);

echo $out;