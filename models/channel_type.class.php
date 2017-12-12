<?php

require_once('aida.class.php');

class ChannelType extends Aida {

    public function __construct() {
        $this->pk = 'id_type';
        $this->fields = ['name', 'user_limit', 'voice'];
        $this->table_name = 'channel_types';
    }
    
}