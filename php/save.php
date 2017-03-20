<?php
header("Access-Control-Allow-Origin: *");

$name = md5($_POST['game']);
$file = '../game/'.$name.'.json';

if ( ! file_exists($file)) {
    file_put_contents($file, $_POST['game']);
}

echo $name;