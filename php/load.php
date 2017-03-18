<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$file = '../game/'.$_GET['game_id'].'.json';

echo json_encode(file($file));