<?php

require_once('aida.class.php');

class User extends Aida {   

    public function __construct() {
        $this->pk = 'id_user';
        $this->fields = ['username', 'avatar', 'email', 'password', 'sr', 'available', 'battletag'];
        $this->table_name = 'users';
    }

}