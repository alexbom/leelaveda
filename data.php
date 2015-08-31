<?php
ob_start();

$html = file('data/'.(int)$_GET['id'].'.html');
array_pop($html);

$text  = implode("\n", $html);
$title = 'Игра Лила - '.trim(strip_tags(array_shift($html)));

$descr = strip_tags($text);
$descr = str_replace('"', '', $descr);
$descr = mb_substr($descr, 0, 160, 'utf-8').'&hellip;';
?>

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
    <link rel="shortcut icon" href="img/favicon/favicon.ico" type="image/x-icon">
    <!--link rel="apple-touch-icon" href="img/favicon/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="72x72" href="img/favicon/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="114x114" href="img/favicon/apple-touch-icon-114x114.png"-->

</head>
<body>

<?=$text?>

<a href="http://leelaveda.ru" id="leela-home">Игра Лила</a>

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