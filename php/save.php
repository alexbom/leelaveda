<?php
header("Access-Control-Allow-Origin: *");
echo '!';die();
$name = md5($_SERVER['REMOTE_ADDR'].time());
$file = '../game/'.$name.'.json';
echo $_POST['game'];
if (file_put_contents($file, $_POST['game'], FILE_APPEND)) echo $name;