<?php

require_once('aida.class.php');

require_once('channel_type.class.php');
require_once('user.class.php');

class Channel extends Aida {

    protected $type;
    protected $owner;

    public function __construct() {
        $this->pk = 'id_channel';
        $this->fields = ['id_type', 'position', 'name', 'description', 'user_id'];
        $this->table_name = 'channels';
    }

    public function hydrate() {

        parent::hydrate();

        $this->type = new Genre();
        $this->type->id_type = $this->id_type;
        $this->type->hydrate();
        
        $this->owner = new User();
        $this->owner->id_user = $this->id_user;
        $this->owner->hydrate();

    }

}