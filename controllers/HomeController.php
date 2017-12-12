<?php

if ($action == 'home') {
    
    $welcome_message = "Salut. T ki?";
    
    $view_path = 'views/'.$action.'.php';
    if (is_file($view_path)) {
        include ($view_path);
    } else {
        die('error no template : '.$view_path);
    }
}