<?php

require_once('utils/route.php');

if (empty($_GET['action'])) {
    $action = 'home';
} else {
    $action = $_GET['action'];
}

$test = 'http://harmony:3000/socket.io/socket.io.js';

$controlle_path = 'controllers/'.$routes[$action].'.php';

if (is_file($controlle_path)) {
    include($controlle_path);
} else {
    die('Illegal action : '.$action);
}