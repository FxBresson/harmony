<?php

require_once('./utils/aida.class.php');

class ChannelType extends Aida {

    public static $pk = 'id_type';
    public static $fields = ['name', 'user_limit', 'voice'];
    public static $table_name = 'channel_types';

    public function __construct() {

    }

}