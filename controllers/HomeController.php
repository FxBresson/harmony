<?php

include __DIR__ . '/../vendor/autoload.php';

$loader = new Twig_Loader_Filesystem('views'); // Dossier contenant les templates
$twig = new Twig_Environment($loader, array('cache' => false ));


if ($action == 'home') {
    
    $view_path = $action.'.html.twig';
    if (is_file('views/'.$view_path)) {
        echo $twig->render($view_path, array('action' => $action));
    } else {
        die('error no template : '.$view_path);
    }
}