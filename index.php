<?php 

require_once('utils/route.php');

function callView() {
    $view_path = 'views/'.$action.'.php';
    if (is_file($view_path)) {
        include ($view_path);
    } else {
        die('error no template : '.$view_path);
    }
}


if (empty($_GET['action'])) {
    $action = 'home';
} else {
    $action = $_GET['action'];
}

$controlle_path = 'controllers/'.$routes[$action].'.php';

if (is_file($controlle_path)) {
    include($controlle_path);
} else {
    die('Illegal action : '.$action);
}