<?php
$html  = file('../data/'.(int)$_GET['id'].'.html');
$body  = implode("\n", $html);
$title = strip_tags($html[1]);
$title = explode('. ', $title);
$title = 'Игра Лила - '.trim($title[1]);
$js    = '';

$descr = preg_replace('/.*?<\/noindex>/s', '', $body);
$descr = strip_tags($descr);
$descr = str_replace('"', '', $descr);
$descr = preg_replace('/&[a-z]+;/s', '', $descr);
$descr = mb_substr($descr, 0, 160, 'utf-8');
$descr = explode(' ', $descr);
array_pop($descr);
$descr = implode(' ', $descr).' ...';
$descr = ltrim($descr);

require('page.php');