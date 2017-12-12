<?php

require_once('aida.class.php');

class Distributeur extends Aida {

    public function __construct() {
        $this->pk = 'id_distributeur';
        $this->fields = ['nom', 'telephone', 'adresse', 'cpostal', 'ville', 'pays'];
        $this->table_name = 'distributeurs';
    }
    
}