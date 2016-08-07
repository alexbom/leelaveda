<?php
$html  = file('../game/'.$_GET['id'].'.txt');
$title = 'Путь игрока';
$descr = '';
$js    = ',{"src" : "js/game.js", "async" : false}';
$body  = json_encode($html);

require('page.php');