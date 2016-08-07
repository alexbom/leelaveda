<?php
$name = md5($_SERVER['REMOTE_ADDR'].time());
$file = '../game/'.$name.'.txt';

if (file_put_contents($file, $_POST['game'], FILE_APPEND)) echo $name;