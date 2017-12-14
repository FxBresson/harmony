<?php

require_once('./utils/aida.class.php');

class User extends Aida {

    public static $pk = 'id_user';
    public static $table_name = 'users';
    public static $fields = ['username', 'avatar', 'email', 'password', 'sr', 'available', 'battletag'];

    public function __construct() {
    }

}