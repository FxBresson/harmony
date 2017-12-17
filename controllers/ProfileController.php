<?php

include __DIR__ . '/../vendor/autoload.php';

$loader = new Twig_Loader_Filesystem('views'); // Dossier contenant les templates
$twig = new Twig_Environment($loader, array('cache' => false ));
$url = 'http://harmony:3000/socket.io/socket.io.js';

if ($action == 'profile') {
    $view_path = $action.'.html.twig';
    $socketUrl = 'http://'.$_SERVER['SERVER_NAME'].':3000/socket.io/socket.io.js';

    if (is_file('views/'.$view_path)) {
        echo $twig->render($view_path, array('action' => $action, 'socketUrl' => $socketUrl));
    } else {
        die('error no template : '.$view_path);
    }
}