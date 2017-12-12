<?php

require_once('aida.class.php');

class Genre extends Aida {

    public function __construct() {
        $this->pk = 'id_genre';
        $this->fields = ['nom'];
        $this->table_name = 'genres';
    }
    
}